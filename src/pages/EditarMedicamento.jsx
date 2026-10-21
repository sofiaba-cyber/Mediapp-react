import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function EditarMedicamento() {

  const [parametros] = useSearchParams()

  const [id, setId] = useState(
    parametros.get('id') || ''
  )

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoria, setCategoria] = useState('1')
  const [mensaje, setMensaje] = useState('')

  const actualizarMedicamento = async (evento) => {

    evento.preventDefault()

    setMensaje('')

    try {

      const respuesta = await api.put(
        `/medicamentos/${id}`,
        {
          nombre: nombre,
          descripcion: descripcion,
          precio: Number(precio),
          stock: Number(stock),
          categoria: Number(categoria)
        }
      )

      console.log(
        '✅ Medicamento actualizado:',
        respuesta.data
      )

      setMensaje(
        '✅ Medicamento actualizado correctamente.'
      )

    } catch (error) {

      console.error(
        '❌ Error al actualizar medicamento:',
        error
      )

      setMensaje(
        error.response?.data?.mensaje ||
        '❌ No se pudo actualizar el medicamento.'
      )

    }

  }

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            ✏️ Editar medicamento
          </h2>

          <p className="text-muted">
            Actualiza la información de un medicamento.
          </p>

        </div>

        <div
          className="card shadow-sm mx-auto"
          style={{ maxWidth: '600px' }}
        >

          <div className="card-body">

            <form onSubmit={actualizarMedicamento}>

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
                  required
                />

              </div>

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
                  Descripción
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={descripcion}
                  onChange={(evento) =>
                    setDescripcion(evento.target.value)
                  }
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Precio
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={precio}
                  onChange={(evento) =>
                    setPrecio(evento.target.value)
                  }
                  min="0"
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Stock
                </label>

                <input
                  type="number"
                  className="form-control"
                  value={stock}
                  onChange={(evento) =>
                    setStock(evento.target.value)
                  }
                  min="0"
                  required
                />

              </div>

              <div className="mb-3">

                <label className="form-label">
                  Categoría
                </label>

                <select
                  className="form-select"
                  value={categoria}
                  onChange={(evento) =>
                    setCategoria(evento.target.value)
                  }
                >

                  <option value="1">
                    Analgésicos
                  </option>

                </select>

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                💾 Actualizar medicamento
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

export default EditarMedicamento