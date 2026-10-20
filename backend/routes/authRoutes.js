const express = require('express')

const {
  registrarUsuario,
  iniciarSesion
} = require('../controllers/authController')

const router = express.Router()

// ====================================
// RUTA PARA REGISTRAR USUARIOS
// ====================================

router.post(
  '/usuarios',
  registrarUsuario
)

// ====================================
// RUTA PARA INICIAR SESIÓN
// ====================================

router.post(
  '/login',
  iniciarSesion
)

module.exports = router