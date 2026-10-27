const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config()

const app = express()
const authRoutes = require('./routes/authRoutes')
// ====================================
// CONFIGURACIÓN
// ====================================

app.use(cors())
app.use(express.json())
app.use('/api', authRoutes)

// ====================================
// CONEXIÓN CON MYSQL
// ====================================

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined
})

// ====================================
// PROBAR CONEXIÓN
// ====================================

db.getConnection((error, connection) => {

  if (error) {
    console.error(
      '❌ Error al conectar con MySQL:',
      error
    )
    return
  }

  console.log(
    '✅ Conectado correctamente a MySQL'
  )

  connection.release()

})
// ====================================
// LOGIN DE USUARIO
// ====================================

app.post('/api/login', (req, res) => {

  const {
    correo,
    password
  } = req.body


  // Verificar que lleguen los datos

  if (
    !correo ||
    !password
  ) {

    return res.status(400).json({

      mensaje:
        'Correo y contraseña son obligatorios.'

    })

  }


  // Buscar usuario en MySQL

  const sql = `
    SELECT
      idUSUARIOS,
      nombre,
      CORREO,
      CONTRASEÑA,
      ROL
    FROM usuarios
    WHERE CORREO = ?
      AND CONTRASEÑA = ?
  `


  db.query(
    sql,
    [
      correo,
      password
    ],
    (error, resultados) => {

      if (error) {

        console.error(
          '❌ Error al iniciar sesión:',
          error
        )

        return res.status(500).json({

          mensaje:
            'Error al consultar el usuario.'

        })

      }


      // Usuario no encontrado

      if (
        resultados.length === 0
      ) {

        return res.status(401).json({

          mensaje:
            'Correo o contraseña incorrectos.'

        })

      }


      // Usuario encontrado

      const usuario =
        resultados[0]


      res.json({

        mensaje:
          '✅ Inicio de sesión correcto.',

        usuario: {

          id:
            usuario.idUSUARIOS,

          nombre:
            usuario.nombre,

          correo:
            usuario.CORREO,

          rol:
            usuario.ROL

        }

      })

    }
  )

})

// ====================================
// RUTA PRINCIPAL
// ====================================

app.get('/', (req, res) => {

  res.json({
    mensaje: '🚀 Servidor de MediApp funcionando'
  })

})

// ====================================
// PROBAR BASE DE DATOS
// ====================================

app.get('/api/prueba-mysql', (req, res) => {

  db.query(
    'SHOW TABLES',
    (error, resultados) => {

      if (error) {

        console.error(
          '❌ Error consultando MySQL:',
          error
        )

        return res.status(500).json({
          error: 'No se pudo consultar MySQL'
        })

      }

      res.json({
        mensaje: '✅ MySQL funciona correctamente',
        tablas: resultados
      })

    }
  )

})

// ====================================
// REGISTRO DE USUARIO Y CLIENTE
// ====================================

app.post('/api/usuarios', (req, res) => {

const {
  nombre,
  correo,
  password,
  rol,
  direccion,
  telefono
} = req.body

  // Validar datos

  if (
    !nombre ||
    !correo ||
    !password ||
    !rol
  ) {

    return res.status(400).json({
      mensaje:
        'Todos los campos son obligatorios.'
    })

  }

  // Insertar usuario

  const sqlUsuario = `
    INSERT INTO usuarios
    (
      nombre,
      CORREO,
      CONTRASEÑA,
      ROL
    )
    VALUES (?, ?, ?, ?)
  `

  db.query(
    sqlUsuario,
    [
      nombre,
      correo,
      password,
      rol
    ],
    (error, resultado) => {

      if (error) {

        console.error(
          '❌ Error al registrar usuario:',
          error
        )

        // Correo duplicado

        if (
          error.code ===
          'ER_DUP_ENTRY'
        ) {

          return res.status(409).json({
            mensaje:
              'Este correo ya está registrado.'
          })

        }

        return res.status(500).json({
          mensaje:
            'Error al registrar el usuario.'
        })

      }

      // ID generado por USUARIOS

      const idUsuario =
        resultado.insertId

      // Crear cliente

const sqlCliente = `
  INSERT INTO cliente
  (
    Correo,
    Dirección,
    Telefono,
    USUARIOS_idUSUARIOS
  )
  VALUES (?, ?, ?, ?)
`
        

     db.query(
  sqlCliente,
[
  correo,
  direccion,
  telefono,
  idUsuario
],
        (errorCliente, resultadoCliente) => {

          if (errorCliente) {

            console.error(
              '❌ Error al crear cliente:',
              errorCliente
            )

            return res.status(500).json({
              mensaje:
                'El usuario fue creado, pero no se pudo crear el cliente.'
            })

          }

          res.status(201).json({

            mensaje:
              '✅ Usuario y cliente registrados correctamente.',

            idUsuario:
              idUsuario,

            idCliente:
              resultadoCliente.insertId

          })

        }
      )

    }
  )

})

// ====================================
// CONSULTAR PERFIL DEL CLIENTE
// ====================================

app.get('/api/clientes/:idUsuario', (req, res) => {

  const idUsuario =
    req.params.idUsuario

  const sql = `
  SELECT
    u.idUSUARIOS,
    u.nombre,
    u.CORREO,
    u.ROL,
    c.idCLIENTE,
    c.Correo,
    c.Dirección,
    c.Telefono
  FROM usuarios u
  INNER JOIN cliente c
    ON c.USUARIOS_idUSUARIOS = u.idUSUARIOS
  WHERE u.idUSUARIOS = ?
`
  

  db.query(
    sql,
    [idUsuario],
    (error, resultados) => {

      if (error) {

        console.error(
          '❌ Error al consultar perfil:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudo consultar el perfil.'
        })

      }

      if (
        resultados.length === 0
      ) {

        return res.status(404).json({
          mensaje:
            'No se encontró el perfil del cliente.'
        })

      }

      const cliente =
        resultados[0]

      res.json({

        mensaje:
          '✅ Perfil encontrado.',

        perfil: {

          idUsuario:
            cliente.idUSUARIOS,

          idCliente:
            cliente.idCLIENTE,

          nombre:
            cliente.nombre,

          correo:
            cliente.CORREO,

          rol:
            cliente.ROL,

          direccion:
            cliente.Dirección,

          telefono:
            cliente.Telefono

        }

      })

    }
  )

})

// ====================================
// ACTUALIZAR PERFIL DEL CLIENTE
// ====================================

app.put('/api/clientes/:idUsuario', (req, res) => {

  const idUsuario =
    req.params.idUsuario

  const {
    nombre,
    correo,
    telefono,
    direccion
  } = req.body

  if (
    !nombre ||
    !correo ||
    !telefono ||
    !direccion
  ) {
    return res.status(400).json({
      mensaje:
        'Todos los campos son obligatorios.'
    })
  }

  const sqlUsuario = `
    UPDATE usuarios
    SET
      nombre = ?,
      CORREO = ?
    WHERE idUSUARIOS = ?
  `

  db.query(
    sqlUsuario,
    [
      nombre,
      correo,
      idUsuario
    ],
    (error) => {

      if (error) {

        console.error(
          '❌ Error al actualizar usuario:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudo actualizar el usuario.'
        })
      }

      const sqlCliente = `
        UPDATE cliente
        SET
          Correo = ?,
          Dirección = ?,
          Telefono = ?
        WHERE USUARIOS_idUSUARIOS = ?
      `

      db.query(
        sqlCliente,
        [
          correo,
          direccion,
          telefono,
          idUsuario
        ],
        (errorCliente) => {

          if (errorCliente) {

            console.error(
              '❌ Error al actualizar cliente:',
              errorCliente
            )

            return res.status(500).json({
              mensaje:
                'El usuario se actualizó, pero no se pudo actualizar el cliente.'
            })
          }

          res.json({
            mensaje:
              '✅ Perfil actualizado correctamente.'
          })

        }
      )
    }
  )
})

// ====================================
// ELIMINAR CLIENTE
// ====================================

app.delete('/api/clientes/:idUsuario', (req, res) => {

  const idUsuario = req.params.idUsuario

  // Buscar el cliente asociado al usuario
  const sqlBuscarCliente = `
    SELECT idCLIENTE
    FROM cliente
    WHERE USUARIOS_idUSUARIOS = ?
  `

  db.query(
    sqlBuscarCliente,
    [idUsuario],
    (error, resultados) => {

      if (error) {
        console.error('❌ Error al buscar cliente:', error)

        return res.status(500).json({
          mensaje: 'No se pudo buscar el cliente.'
        })
      }

      if (resultados.length === 0) {
        return res.status(404).json({
          mensaje: 'No se encontró el cliente.'
        })
      }

      const idCliente = resultados[0].idCLIENTE

      // Buscar los pedidos del cliente
      const sqlBuscarPedidos = `
        SELECT idPEDIDO
        FROM pedido
        WHERE CLIENTE_idCLIENTE = ?
      `

      db.query(
        sqlBuscarPedidos,
        [idCliente],
        (errorPedidos, pedidos) => {

          if (errorPedidos) {
            console.error(
              '❌ Error al buscar pedidos:',
              errorPedidos
            )

            return res.status(500).json({
              mensaje: 'No se pudieron buscar los pedidos.'
            })
          }

          // IDs de los pedidos encontrados
          const idsPedidos = pedidos.map(
            pedido => pedido.idPEDIDO
          )

          // Si existen pedidos, primero eliminar sus detalles
          const eliminarPedidos = () => {

            if (idsPedidos.length === 0) {
              return eliminarCliente()
            }

            const sqlEliminarDetalles = `
              DELETE FROM detalle_pedido
              WHERE PEDIDO_idPEDIDO IN (?)
            `

            db.query(
              sqlEliminarDetalles,
              [idsPedidos],
              (errorDetalles) => {

                if (errorDetalles) {
                  console.error(
                    '❌ Error al eliminar detalles:',
                    errorDetalles
                  )

                  return res.status(500).json({
                    mensaje:
                      'No se pudieron eliminar los detalles de los pedidos.'
                  })
                }

                // Después de eliminar los detalles,
                // eliminar los pedidos
                const sqlEliminarPedidos = `
                  DELETE FROM pedido
                  WHERE CLIENTE_idCLIENTE = ?
                `

                db.query(
                  sqlEliminarPedidos,
                  [idCliente],
                  (errorEliminarPedidos) => {

                    if (errorEliminarPedidos) {
                      console.error(
                        '❌ Error al eliminar pedidos:',
                        errorEliminarPedidos
                      )

                      return res.status(500).json({
                        mensaje:
                          'No se pudieron eliminar los pedidos.'
                      })
                    }

                    eliminarCliente()
                  }
                )
              }
            )
          }

          // Eliminar cliente y usuario
          const eliminarCliente = () => {

            const sqlEliminarCliente = `
              DELETE FROM cliente
              WHERE idCLIENTE = ?
            `

            db.query(
              sqlEliminarCliente,
              [idCliente],
              (errorCliente) => {

                if (errorCliente) {
                  console.error(
                    '❌ Error al eliminar cliente:',
                    errorCliente
                  )

                  return res.status(500).json({
                    mensaje:
                      'No se pudo eliminar el cliente.'
                  })
                }

                const sqlEliminarUsuario = `
                  DELETE FROM usuarios
                  WHERE idUSUARIOS = ?
                `

                db.query(
                  sqlEliminarUsuario,
                  [idUsuario],
                  (errorUsuario) => {

                    if (errorUsuario) {
                      console.error(
                        '❌ Error al eliminar usuario:',
                        errorUsuario
                      )

                      return res.status(500).json({
                        mensaje:
                          'El cliente fue eliminado, pero no se pudo eliminar el usuario.'
                      })
                    }

                    res.json({
                      mensaje:
                        '✅ Cliente, pedidos y usuario eliminados correctamente.'
                    })
                  }
                )
              }
            )
          }

          // Comenzar eliminación
          eliminarPedidos()
        }
      )
    }
  )
})

// ====================================
// CREAR PEDIDO
// ====================================

app.post('/api/pedidos', (req, res) => {

  const {
    idUsuario,
    productos,
    total,
    direccion,
    referencia
  } = req.body

  if (
    !idUsuario ||
    !productos ||
    productos.length === 0 ||
    !total ||
    !direccion
  ) {
    return res.status(400).json({
      mensaje: 'Faltan datos para crear el pedido.'
    })
  }

  // Buscar cliente
  const sqlCliente = `
    SELECT idCLIENTE
    FROM cliente
    WHERE USUARIOS_idUSUARIOS = ?
  `

  db.query(
    sqlCliente,
    [idUsuario],
    (errorCliente, resultadosCliente) => {

      if (errorCliente) {
        console.error(
          '❌ Error al buscar cliente:',
          errorCliente
        )

        return res.status(500).json({
          mensaje: 'No se pudo buscar el cliente.'
        })
      }

      if (resultadosCliente.length === 0) {
        return res.status(404).json({
          mensaje: 'El usuario no tiene un cliente asociado.'
        })
      }

      const idCliente = resultadosCliente[0].idCLIENTE

      // Crear pedido
      const sqlPedido = `
        INSERT INTO pedido
        (
          Fecha,
          Estado,
          Total,
          direccion,
          Referencia,
          CLIENTE_idCLIENTE
        )
        VALUES
        (
          NOW(),
          ?,
          ?,
          ?,
          ?,
          ?
        )
      `

      db.query(
        sqlPedido,
        [
          'En proceso',
          total,
          direccion,
          referencia || null,
          idCliente
        ],
        (errorPedido, resultadoPedido) => {

          if (errorPedido) {
            console.error(
              '❌ Error al crear pedido:',
              errorPedido
            )

            return res.status(500).json({
              mensaje: 'No se pudo crear el pedido.'
            })
          }

          const idPedido = resultadoPedido.insertId

          // Crear detalles
          let detallesProcesados = 0

          productos.forEach((producto) => {

            const sqlDetalle = `
              INSERT INTO detalle_pedido
              (
                cantidad,
                precio_unitario,
                MEDICAMENTO_idMEDICAMENTO,
                PEDIDO_idPEDIDO
              )
              VALUES (?, ?, ?, ?)
            `

            db.query(
              sqlDetalle,
              [
                Number(producto.cantidad),
                Number(producto.precio),
                Number(producto.idMedicamento),
                idPedido
              ],
              (errorDetalle) => {

                if (errorDetalle) {

                  console.error(
                    '❌ ERROR AL GUARDAR DETALLE_PEDIDO:',
                    errorDetalle
                  )

                  return res.status(500).json({
                    mensaje:
                      'El pedido se creó, pero no se pudo guardar el detalle.',
                    error:
                      errorDetalle.message
                  })
                }

                detallesProcesados++

                if (
                  detallesProcesados === productos.length
                ) {

                  console.log(
                    '✅ Pedido guardado:',
                    idPedido
                  )

                  console.log(
                    '✅ Detalles guardados:',
                    productos
                  )

                  res.status(201).json({
                    mensaje:
                      '✅ Pedido y detalles creados correctamente.',
                    idPedido: idPedido,
                    idCliente: idCliente
                  })
                }
              }
            )
          })
        }
      )
    }
  )
})

  // ====================================
// OBTENER PEDIDOS DE UN CLIENTE
// ====================================

app.get('/api/pedidos/:idUsuario', (req, res) => {

  const { idUsuario } = req.params

  const sql = `
    SELECT
      p.idPEDIDO,
      p.Fecha,
      p.Estado,
      p.Total,
      p.direccion,
      p.Referencia,
      dp.idDETALLE_PEDIDO,
      dp.cantidad,
      dp.precio_unitario,
      m.idMEDICAMENTO,
      m.Nombre AS medicamento
    FROM pedido p
    INNER JOIN cliente c
      ON p.CLIENTE_idCLIENTE = c.idCLIENTE
    INNER JOIN detalle_pedido dp
      ON dp.PEDIDO_idPEDIDO = p.idPEDIDO
    INNER JOIN medicamento m
      ON dp.MEDICAMENTO_idMEDICAMENTO = m.idMEDICAMENTO
    WHERE c.USUARIOS_idUSUARIOS = ?
    ORDER BY p.idPEDIDO DESC
  `

  db.query(
    sql,
    [idUsuario],
    (error, resultados) => {

      if (error) {

        console.error(
          '❌ Error al obtener pedidos:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudieron obtener los pedidos.'
        })
      }

      res.json(resultados)

    }
  )
})

// ====================================
// CAMBIAR ESTADO DEL PEDIDO
// ====================================

app.put('/api/pedidos/:idPedido/estado', (req, res) => {

  const { idPedido } = req.params
  const { estado } = req.body

  const estadosPermitidos = [
    'En proceso',
    'En camino',
    'Entregado'
  ]

  if (!estado) {

    return res.status(400).json({
      mensaje: 'Debes indicar el nuevo estado.'
    })

  }

  if (!estadosPermitidos.includes(estado)) {

    return res.status(400).json({
      mensaje: 'El estado indicado no es válido.'
    })

  }

  const sql = `
    UPDATE pedido
    SET Estado = ?
    WHERE idPEDIDO = ?  
  `

  db.query(
    sql,
    [estado, idPedido],
    (error, resultado) => {

      if (error) {

        console.error(
          '❌ Error al cambiar estado:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudo cambiar el estado del pedido.'
        })

      }

      if (resultado.affectedRows === 0) {

        return res.status(404).json({
          mensaje:
            'No se encontró el pedido.'
        })

      }

      res.json({
        mensaje:
          '✅ Estado del pedido actualizado correctamente.',
        idPedido: idPedido,
        estado: estado
      })

    }
  )

})
// ====================================
// ELIMINAR PEDIDO
// ====================================

app.delete('/api/pedidos/:idPedido', (req, res) => {

  const idPedido = req.params.idPedido

  // Primero eliminar los detalles asociados al pedido
  const sqlDetalles = `
    DELETE FROM detalle_pedido
    WHERE PEDIDO_idPEDIDO = ?
  `

  db.query(
    sqlDetalles,
    [idPedido],
    (errorDetalles) => {

      if (errorDetalles) {

        console.error(
          '❌ Error al eliminar los detalles del pedido:',
          errorDetalles
        )

        return res.status(500).json({
          mensaje:
            'No se pudieron eliminar los detalles del pedido.'
        })
      }

      // Después eliminar el pedido
      const sqlPedido = `
        DELETE FROM pedido
        WHERE idPEDIDO = ?
      `

      db.query(
        sqlPedido,
        [idPedido],
        (errorPedido, resultado) => {

          if (errorPedido) {

            console.error(
              '❌ Error al eliminar el pedido:',
              errorPedido
            )

            return res.status(500).json({
              mensaje:
                'No se pudo eliminar el pedido.'
            })
          }

          if (resultado.affectedRows === 0) {

            return res.status(404).json({
              mensaje:
                'No se encontró el pedido.'
            })
          }

          res.json({
            mensaje:
              '✅ Pedido eliminado correctamente.'
          })

        }
      )
    }
  )
})
// ====================================
// INICIAR SERVIDOR
// ====================================
app.get('/api/medicamentos', (req, res) => {

  const sql = `
  SELECT
    idMEDICAMENTO,
    Nombre,
    descripcion,
    precio,
    stock,
    CATEGORIA_idCATEGORIA
  FROM medicamento
  ORDER BY Nombre ASC
`

  db.query(sql, (error, resultados) => {

    if (error) {

      console.error(
        '❌ Error al obtener medicamentos:',
        error
      )

      return res.status(500).json({
        mensaje:
          'No se pudieron obtener los medicamentos.'
      })
    }

    res.json(resultados)

  })
})
// ====================================
// CREAR MEDICAMENTO
// ====================================

app.post('/api/medicamentos', (req, res) => {

  const {
    nombre,
    descripcion,
    precio,
    stock,
    categoria
  } = req.body

  if (
    !nombre ||
    !descripcion ||
    precio === undefined ||
    stock === undefined ||
    !categoria
  ) {

    return res.status(400).json({
      mensaje:
        'Todos los datos del medicamento son obligatorios.'
    })

  }

  const sql = `
    INSERT INTO medicamento
    (
      Nombre,
      descripcion,
      precio,
      stock,
      CATEGORIA_idCATEGORIA
    )
    VALUES (?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      nombre,
      descripcion,
      precio,
      stock,
      categoria
    ],
    (error, resultado) => {

      if (error) {

        console.error(
          '❌ Error al crear medicamento:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudo crear el medicamento.'
        })

      }

      res.status(201).json({

        mensaje:
          '✅ Medicamento creado correctamente.',

        idMedicamento:
          resultado.insertId

      })

    }
  )

})
// ====================================
// ACTUALIZAR MEDICAMENTO
// ====================================

app.put('/api/medicamentos/:id', (req, res) => {

  const idMedicamento = req.params.id

  const {
    nombre,
    descripcion,
    precio,
    stock,
    categoria
  } = req.body

  if (
    !nombre ||
    !descripcion ||
    precio === undefined ||
    stock === undefined ||
    !categoria
  ) {

    return res.status(400).json({
      mensaje:
        'Todos los datos del medicamento son obligatorios.'
    })

  }

  const sql = `
    UPDATE medicamento
    SET
      Nombre = ?,
      descripcion = ?,
      precio = ?,
      stock = ?,
      CATEGORIA_idCATEGORIA = ?
    WHERE idMEDICAMENTO = ?
  `

  db.query(
    sql,
    [
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      idMedicamento
    ],
    (error, resultado) => {

      if (error) {

        console.error(
          '❌ Error al actualizar medicamento:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudo actualizar el medicamento.'
        })

      }

      if (resultado.affectedRows === 0) {

        return res.status(404).json({
          mensaje:
            'No se encontró el medicamento.'
        })

      }

      res.json({
        mensaje:
          '✅ Medicamento actualizado correctamente.'
      })

    }
  )

})
// ====================================
// ELIMINAR MEDICAMENTO
// ====================================

app.delete('/api/medicamentos/:id', (req, res) => {

  const idMedicamento = req.params.id

  const sql = `
    DELETE FROM medicamento
    WHERE idMEDICAMENTO = ?
  `

  db.query(
    sql,
    [idMedicamento],
    (error, resultado) => {

      if (error) {

        console.error(
          '❌ Error al eliminar medicamento:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudo eliminar el medicamento.'
        })

      }

      if (resultado.affectedRows === 0) {

        return res.status(404).json({
          mensaje:
            'No se encontró el medicamento.'
        })

      }

      res.json({
        mensaje:
          '✅ Medicamento eliminado correctamente.'
      })

    }
  )

})
// ====================================
// NOTIFICACIONES
// ====================================

app.get('/api/notificaciones/:idUsuario', (req, res) => {

  const idUsuario = req.params.idUsuario

  const sql = `
    SELECT
      notificación.idNOTIFICACIÓN,
      notificación.mensaje,
      notificación.Fecha,
      notificación.leida
    FROM notificación
    INNER JOIN cliente
      ON CLIENTE.idCLIENTE =
         notificación.CLIENTE_idCLIENTE
    WHERE CLIENTE.USUARIOS_idUSUARIOS = ?
    ORDER BY notificación.idNOTIFICACIÓN DESC
  `

  db.query(
    sql,
    [idUsuario],
    (error, resultados) => {

      if (error) {

        console.error(
          '❌ Error al obtener notificaciones:',
          error
        )

        return res.status(500).json({
          mensaje:
            'No se pudieron obtener las notificaciones.'
        })
      }

      res.json(resultados)

    }
  )

})
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    `🚀 Servidor ejecutándose en el puerto ${PORT}`
  )
})