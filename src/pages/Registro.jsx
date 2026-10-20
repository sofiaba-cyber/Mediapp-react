import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Registro() {

  const navegar = useNavigate()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [direccion, setDireccion] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')

  const registrarUsuario = async (evento) => {

    evento.preventDefault()

    setMensaje('')

    if (password !== confirmarPassword) {

      setMensaje(
        '❌ Las contraseñas no coinciden.'
      )

      return
    }

    try {

      const respuesta =
        await api.post(
          '/usuarios',
          {
            nombre: nombre,
            correo: correo,
            password: password,
            rol: 'cliente',
            direccion: direccion,
            telefono: telefono
          }
        )

      console.log(
        '✅ Registro:',
        respuesta.data
      )

      setMensaje(
        '✅ Cuenta creada correctamente.'
      )

      setTimeout(() => {
        navegar('/login')
      }, 1000)

    } catch (error) {

      console.error(
        '❌ Error al registrar:',
        error
      )

      setMensaje(
        error.response?.data?.mensaje ||
        '❌ No se pudo crear la cuenta.'
      )
    }
  }

  return (

    <div className="container min-vh-100 d-flex align-items-center justify-content-center">

      <div
        className="card shadow p-4"
        style={{
          maxWidth: '500px',
          width: '100%'
        }}
      >

        <div className="text-center mb-4">

          <h1 className="text-primary">
            💊 MediApp
          </h1>

          <p className="text-muted">
            Entrega de medicamentos a domicilio
          </p>

        </div>

        <h2 className="text-center mb-4">
          Crear cuenta
        </h2>

        <form onSubmit={registrarUsuario}>

          <div className="mb-3">

            <label className="form-label">
              Nombre completo
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Ingresa tu nombre"
              value={nombre}
              onChange={(evento) =>
                setNombre(evento.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Correo electrónico
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(evento) =>
                setCorreo(evento.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Contraseña
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(evento) =>
                setPassword(evento.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Confirmar contraseña
            </label>

            <input
              type="password"
              className="form-control"
              placeholder="Confirma tu contraseña"
              value={confirmarPassword}
              onChange={(evento) =>
                setConfirmarPassword(evento.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Dirección
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Ejemplo: Calle 10 # 20-30, Bogotá"
              value={direccion}
              onChange={(evento) =>
                setDireccion(evento.target.value)
              }
              required
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Teléfono
            </label>

            <input
              type="tel"
              className="form-control"
              placeholder="Ejemplo: 3001234567"
              value={telefono}
              onChange={(evento) =>
                setTelefono(evento.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Registrarse
          </button>

        </form>

        {mensaje && (

          <div className="alert alert-info mt-3 text-center">
            {mensaje}
          </div>

        )}

      </div>

    </div>

  )
}

export default Registro