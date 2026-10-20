const db = require('../config/database')

// ====================================
// BUSCAR USUARIO PARA INICIAR SESIÓN
// ====================================

const buscarUsuarioPorCredenciales = (
  correo,
  password,
  callback
) => {

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
    callback
  )
}


// ====================================
// CREAR USUARIO
// ====================================

const crearUsuario = (
  nombre,
  correo,
  password,
  rol,
  callback
) => {

  const sql = `
    INSERT INTO USUARIOS
    (
      nombre,
      CORREO,
      CONTRASEÑA,
      ROL
    )
    VALUES (?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      nombre,
      correo,
      password,
      rol
    ],
    callback
  )
}


module.exports = {
  buscarUsuarioPorCredenciales,
  crearUsuario
}