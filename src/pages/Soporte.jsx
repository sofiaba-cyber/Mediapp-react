import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Soporte() {

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [respuesta, setRespuesta] = useState('')

  const enviarSolicitud = (evento) => {

    evento.preventDefault()

    setRespuesta(
      '✅ Tu solicitud fue enviada correctamente. Pronto nos pondremos en contacto contigo.'
    )

    setNombre('')
    setCorreo('')
    setMensaje('')
  }

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            📞 Soporte y contacto
          </h2>

          <p className="text-muted">
            ¿Necesitas ayuda? Envíanos tu solicitud.
          </p>

        </div>

        <div
          className="card shadow-sm mx-auto"
          style={{ maxWidth: '600px' }}
        >

          <div className="card-body">

            <h4 className="mb-4">
              Formulario de soporte
            </h4>

            <form onSubmit={enviarSolicitud}>

              <div className="mb-3">

                <label className="form-label">
                  Nombre
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
                  Describe tu solicitud
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Escribe aquí tu solicitud..."
                  value={mensaje}
                  onChange={(evento) =>
                    setMensaje(evento.target.value)
                  }
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                📩 Enviar solicitud
              </button>

            </form>

            {respuesta && (

              <div className="alert alert-success mt-4">
                {respuesta}
              </div>

            )}

          </div>

        </div>

      </main>

      <Footer />

    </div>

  )
}

export default Soporte