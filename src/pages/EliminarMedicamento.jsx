import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function EliminarMedicamento() {

  const [id, setId] = useState('')
  const [mensaje, setMensaje] = useState('')

  const eliminarMedicamento = async (evento) => {

    evento.preventDefault()

    setMensaje('')

    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este medicamento?'
    )

    if (!confirmar) {
      return
    }

    try {

      const respuesta = await api.delete(
        `/medicamentos/${id}`
      )

      console.log(
        '✅ Medicamento eliminado:',
        respuesta.data
      )

      setMensaje(
        '✅ Medicamento eliminado correctamente.'
      )

      setId('')

    } catch (error) {

      console.error(
        '❌ Error al eliminar medicamento:',
        error
      )

      setMensaje(
        error.response?.data?.mensaje ||
        '❌ No se pudo eliminar el medicamento.'
      )

    }

  }

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-danger">
            🗑️ Eliminar medicamento
          </h2>

          <p className="text-muted">
            Elimina un medicamento del inventario.
          </p>

        </div>

        <div
          className="card shadow-sm mx-auto"
          style={{ maxWidth: '500px' }}
        >

          <div className="card-body">

            <form onSubmit={eliminarMedicamento}>

              <div className="mb-3">

                <label className="form-label">
                  ID del medicamento
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={id}
                  onChange={(evento) =>
                    setId(evento.target.value)
                  }
                  placeholder="Ejemplo: 10"
                  min="1"
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-danger w-100"
              >
                🗑️ Eliminar medicamento
              </button>

            </form>

            {mensaje && (

              <div className="alert alert-info mt-4 text-center">
                {mensaje}
              </div>

            )}

          </div>

        </div>

      </main>

      <Footer />

    </div>

  )
}

export default EliminarMedicamento