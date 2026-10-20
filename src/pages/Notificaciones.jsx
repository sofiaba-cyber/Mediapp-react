import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function Notificaciones() {

  const [notificaciones, setNotificaciones] = useState([])
  const [mensaje, setMensaje] = useState(
    'Cargando notificaciones...'
  )

  useEffect(() => {

    const cargarNotificaciones = async () => {

      try {

        const usuario =
          JSON.parse(
            localStorage.getItem('usuarioMediApp')
          )

        if (!usuario) {

          setMensaje(
            '❌ Debes iniciar sesión para ver tus notificaciones.'
          )

          return
        }

        const respuesta =
          await api.get(
            `/notificaciones/${usuario.id}`
          )

        console.log(
          '✅ Notificaciones recibidas:',
          respuesta.data
        )

        setNotificaciones(
          respuesta.data
        )

        if (respuesta.data.length === 0) {

          setMensaje(
            'No tienes notificaciones por el momento.'
          )

        } else {

          setMensaje('')

        }

      } catch (error) {

        console.error(
          '❌ Error al cargar notificaciones:',
          error
        )

        setMensaje(
          error.response?.data?.mensaje ||
          '❌ No se pudieron cargar las notificaciones.'
        )

      }

    }

    cargarNotificaciones()

  }, [])

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            🔔 Notificaciones
          </h2>

          <p className="text-muted">
            Consulta las novedades de tus pedidos.
          </p>

        </div>

        {mensaje && (

          <div className="alert alert-info text-center">
            {mensaje}
          </div>

        )}

        <div className="row g-4">

          {notificaciones.map(
            (notificacion) => (

              <div
                className="col-md-6"
                key={
                  notificacion.idNOTIFICACIÓN
                }
              >

                <div className="card shadow-sm h-100">

                  <div className="card-body">

                    <h5 className="card-title">

                      {notificacion.leida
                        ? '🔔 Notificación'
                        : '🆕 Nueva notificación'}

                    </h5>

                    <p className="card-text">
                      {notificacion.mensaje}
                    </p>

                    <p className="text-muted mb-2">

                      <strong>Fecha:</strong>{' '}

                      {notificacion.Fecha}

                    </p>

                    <p className="mb-0">

                      <strong>Estado:</strong>{' '}

                      {notificacion.leida
                        ? 'Leída'
                        : 'Nueva'}

                    </p>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </main>

      <Footer />

    </div>

  )
}

export default Notificaciones
