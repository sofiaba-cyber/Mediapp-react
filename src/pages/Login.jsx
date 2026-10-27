import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function Login() {

  const navegar = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')

  const iniciarSesion = async (evento) => {

    evento.preventDefault()

    setMensaje('')

    try {

      const respuesta = await api.post('/login', {
        correo: correo,
        password: contrasena
      })

      console.log(
        'Respuesta del servidor:',
        respuesta.data
      )

      localStorage.setItem(
        'usuarioMediApp',
        JSON.stringify(respuesta.data.usuario)
      )

      setMensaje(
        '✅ Inicio de sesión exitoso'
      )

      setTimeout(() => {
        navegar('/inicio')
      }, 500)

    } catch (error) {

      console.error(
        '❌ Error al iniciar sesión:',
        error
      )

      if (error.response) {

        setMensaje(
          error.response.data.mensaje ||
          'Correo o contraseña incorrectos'
        )

      } else {

        setMensaje(
          '❌ No se pudo conectar con el servidor'
        )

      }

    }

  }

  return (

    <div className="container min-vh-100 d-flex align-items-center justify-content-center">

      <div
        className="card shadow p-4"
        style={{
          maxWidth: '450px',
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
          Inicio de sesión
        </h2>

        <form onSubmit={iniciarSesion}>

          <div className="mb-3">

            <label className="form-label">
              Correo electrónico
            </label>

            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(evento) =>
                setCorreo(evento.target.value)
              }
              placeholder="Ingresa tu correo"
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
              value={contrasena}
              onChange={(evento) =>
                setContrasena(evento.target.value)
              }
              placeholder="Ingresa tu contraseña"
              required
            />

          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Iniciar sesión
          </button>

        </form>

        {mensaje && (

          <div className="alert alert-info mt-3 text-center">
            {mensaje}
          </div>

        )}

        <div className="text-center mt-4">

          <p className="mb-2">
            ¿No tienes una cuenta?
          </p>

          <Link
            to="/registro"
            className="btn btn-outline-primary"
          >
            Crear cuenta
          </Link>

        </div>

      </div>

    </div>

  )
}

export default Login