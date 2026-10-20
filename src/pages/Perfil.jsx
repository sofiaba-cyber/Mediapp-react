import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function Perfil() {

  const [perfil, setPerfil] = useState(null)

  const [editando, setEditando] = useState(false)

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')

  const [mensaje, setMensaje] = useState('')

  useEffect(() => {

    const cargarPerfil = async () => {

      try {

        const usuario =
          JSON.parse(
            localStorage.getItem('usuarioMediApp')
          )

        if (!usuario) {

          setMensaje(
            '❌ Debes iniciar sesión para ver tu perfil.'
          )

          return
        }

        const respuesta =
          await api.get(
            `/clientes/${usuario.id}`
          )

        console.log(
          '✅ Perfil recibido:',
          respuesta.data
        )

        const datos =
          respuesta.data.perfil

        setPerfil(datos)

        setNombre(datos.nombre)
        setCorreo(datos.correo)
        setTelefono(datos.telefono)
        setDireccion(datos.direccion)

      } catch (error) {

        console.error(
          '❌ Error al cargar perfil:',
          error
        )

        setMensaje(
          error.response?.data?.mensaje ||
          '❌ No se pudo cargar el perfil.'
        )

      }

    }

    cargarPerfil()

  }, [])

  const guardarPerfil = async (evento) => {

    evento.preventDefault()

    try {

      const usuario =
        JSON.parse(
          localStorage.getItem('usuarioMediApp')
        )

      if (!usuario) {

        setMensaje(
          '❌ Debes iniciar sesión.'
        )

        return
      }

      const respuesta =
        await api.put(
          `/clientes/${usuario.id}`,
          {
            nombre: nombre,
            correo: correo,
            telefono: telefono,
            direccion: direccion
          }
        )

      console.log(
        '✅ Perfil actualizado:',
        respuesta.data
      )

      setPerfil({
        ...perfil,
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        direccion: direccion
      })

      setEditando(false)

      setMensaje(
        '✅ Perfil actualizado correctamente.'
      )

    } catch (error) {

      console.error(
        '❌ Error al actualizar perfil:',
        error
      )

      setMensaje(
        error.response?.data?.mensaje ||
        '❌ No se pudo actualizar el perfil.'
      )

    }

  }

  if (!perfil) {

    return (

      <div className="min-vh-100 d-flex flex-column">

        <Header />

        <main className="container py-5 flex-grow-1">

          <div className="alert alert-info text-center">
            {mensaje || 'Cargando perfil...'}
          </div>

        </main>

        <Footer />

      </div>

    )

  }

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            👤 Mi perfil
          </h2>

          <p className="text-muted">
            Consulta y actualiza tu información personal.
          </p>

        </div>

        {mensaje && (

          <div className="alert alert-info text-center">
            {mensaje}
          </div>

        )}

        <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>

          <div className="card-body">

            <h4 className="mb-4">
              Información personal
            </h4>

            {!editando ? (

              <>

                <p>
                  <strong>Nombre:</strong>{' '}
                  {perfil.nombre}
                </p>

                <p>
                  <strong>Correo:</strong>{' '}
                  {perfil.correo}
                </p>

                <p>
                  <strong>Teléfono:</strong>{' '}
                  {perfil.telefono}
                </p>

                <p>
                  <strong>Dirección:</strong>{' '}
                  {perfil.direccion}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => setEditando(true)}
                >
                  ✏️ Editar perfil
                </button>

              </>

            ) : (

              <form onSubmit={guardarPerfil}>

                <div className="mb-3">

                  <label className="form-label">
                    Nombre
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(evento) =>
                      setNombre(evento.target.value)
                    }
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Correo
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    value={correo}
                    onChange={(evento) =>
                      setCorreo(evento.target.value)
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
                    value={telefono}
                    onChange={(evento) =>
                      setTelefono(evento.target.value)
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
                    value={direccion}
                    onChange={(evento) =>
                      setDireccion(evento.target.value)
                    }
                    required
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary me-2"
                >
                  💾 Guardar cambios
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditando(false)}
                >
                  Cancelar
                </button>

              </form>

            )}

          </div>

        </div>

      </main>

      <Footer />

    </div>

  )
}

export default Perfil
