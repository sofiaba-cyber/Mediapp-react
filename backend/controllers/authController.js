const db = require('../config/database')

// ====================================
// REGISTRAR USUARIO
// ====================================

const registrarUsuario = (req, res) => {

  const {
    nombre,
    correo,
    password,
    rol,
    direccion,
    telefono
  } = req.body

  // Validación de datos obligatorios
  if (
    !nombre ||
    !correo ||
    !password ||
    !rol
  ) {

    return res.status(400).json({
      mensaje:
        'Todos los datos obligatorios deben ser enviados.'
    })

  }

  const sqlUsuario = `
    INSERT INTO USUARIOS
    (nombre, CORREO, CONTRASEÑA, ROL)
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

        if (error.code === 'ER_DUP_ENTRY') {

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

      const idUsuario = resultado.insertId

      const sqlCliente = `
        INSERT INTO CLIENTE
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
            idUsuario: idUsuario,
            idCliente:
              resultadoCliente.insertId
          })

        }
      )

    }
  )

}


// ====================================
// INICIAR SESIÓN
// ====================================

const iniciarSesion = (req, res) => {

  const {
    correo,
    password
  } = req.body

  // Validación de datos
  if (
    !correo ||
    !password
  ) {

    return res.status(400).json({
      mensaje:
        'Correo y contraseña son obligatorios.'
    })

  }

  const sql = `
    SELECT
      idUSUARIOS,
      nombre,
      CORREO,
      CONTRASEÑA,
      ROL
    FROM USUARIOS
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

      if (
        resultados.length === 0
      ) {

        return res.status(401).json({
          mensaje:
            'Correo o contraseña incorrectos.'
        })

      }

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

}


module.exports = {
  registrarUsuario,
  iniciarSesion
}