const usuarioModel = require('../models/usuarioModel')

// ====================================
// SERVICIO PARA REGISTRAR USUARIO
// ====================================

const registrarUsuario = (
  nombre,
  correo,
  password,
  rol,
  callback
) => {

  usuarioModel.crearUsuario(
    nombre,
    correo,
    password,
    rol,
    callback
  )

}


// ====================================
// SERVICIO PARA INICIAR SESIÓN
// ====================================

const iniciarSesion = (
  correo,
  password,
  callback
) => {

  usuarioModel.buscarUsuarioPorCredenciales(
    correo,
    password,
    callback
  )

}


module.exports = {
  registrarUsuario,
  iniciarSesion
}