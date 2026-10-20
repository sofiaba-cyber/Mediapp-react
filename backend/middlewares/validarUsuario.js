// ====================================
// VALIDAR DATOS DEL USUARIO
// ====================================

const validarUsuario = (req, res, next) => {

  const {
    nombre,
    correo,
    password,
    rol
  } = req.body


  // ====================================
  // VALIDAR DATOS OBLIGATORIOS
  // ====================================

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


  // ====================================
  // VALIDAR CORREO
  // ====================================

  if (!correo.includes('@')) {

    return res.status(400).json({
      mensaje:
        'El correo electrónico no es válido.'
    })

  }


  // ====================================
  // CONTINUAR CON LA PETICIÓN
  // ====================================

  next()

}


module.exports = validarUsuario