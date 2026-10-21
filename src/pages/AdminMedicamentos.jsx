import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function AdminMedicamentos() {

  const navegar = useNavigate()

  const [medicamentos, setMedicamentos] = useState([])

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoria, setCategoria] = useState('1')
  const [mensaje, setMensaje] = useState('')

  // Cargar medicamentos
  const cargarMedicamentos = async () => {

    try {

      const respuesta = await api.get('/medicamentos')

console.log(
  '📋 Medicamentos recibidos:',
  respuesta.data
)

setMedicamentos(respuesta.data)

    } catch (error) {

      console.error(
        '❌ Error al cargar medicamentos:',
        error
      )

      setMensaje(
        '❌ No se pudieron cargar los medicamentos.'
      )

    }

  }

  useEffect(() => {

    cargarMedicamentos()

  }, [])

  // Registrar medicamento
  const crearMedicamento = async (evento) => {

    evento.preventDefault()

    setMensaje('')

    try {

      await api.post(
        '/medicamentos',
        {
          nombre: nombre,
          descripcion: descripcion,
          precio: Number(precio),
          stock: Number(stock),
          categoria: Number(categoria)
        }
      )

      setMensaje(
        '✅ Medicamento creado correctamente.'
      )

      setNombre('')
      setDescripcion('')
      setPrecio('')
      setStock('')
      setCategoria('1')

      cargarMedicamentos()

    } catch (error) {

      console.error(
        '❌ Error al crear medicamento:',
        error
      )

      setMensaje(
        error.response?.data?.mensaje ||
        '❌ No se pudo crear el medicamento.'
      )

    }

  }

  // Eliminar medicamento
  const eliminarMedicamento = async (id) => {

    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este medicamento?'
    )

    if (!confirmar) {
      return
    }

    try {

      await api.delete(
        `/medicamentos/${id}`
      )

      setMensaje(
        '✅ Medicamento eliminado correctamente.'
      )

      cargarMedicamentos()

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

          <h2 className="text-primary">
            ⚙️ Administrar medicamentos
          </h2>

          <p className="text-muted">
            Registrar, consultar, actualizar y eliminar medicamentos.
          </p>

        </div>

        {/* FORMULARIO */}

        <div
          className="card shadow-sm mx-auto mb-5"
          style={{ maxWidth: '600px' }}
        >

          <div className="card-body">

            <h4 className="text-center mb-4">
              💊 Registrar medicamento
            </h4>

            <form onSubmit={crearMedicamento}>

              <div className="mb-3">

                <label className="form-label">
                  Nombre del medicamento
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
                💊 Registrar medicamento
              </button>

            </form>

          </div>

        </div>

        {/* MENSAJE */}

        {mensaje && (

          <div className="alert alert-info text-center">
            {mensaje}
          </div>

        )}

        {/* TABLA */}

        <div className="card shadow-sm">

          <div className="card-body">

            <h4 className="mb-4">
              📋 Medicamentos registrados
            </h4>

            <div className="table-responsive">

              <table className="table table-bordered table-hover">

                <thead className="table-primary">

                  <tr>

                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>

                  </tr>

                </thead>

                <tbody>

                  {medicamentos.map((medicamento) => (

                    <tr key={medicamento.idMEDICAMENTO}>

                      <td>
                        {medicamento.idMEDICAMENTO}
                      </td>

                      <td>
                        {medicamento.Nombre ||
                         medicamento.nombre}
                      </td>

                      <td>
                        ${medicamento.precio}
                      </td>

                      <td>
                        {medicamento.stock}
                      </td>

                      <td>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            navegar(
                              `/admin/medicamentos/editar?id=${medicamento.idMEDICAMENTO}`
                            )
                          }
                        >
                          ✏️ Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            eliminarMedicamento(
                              medicamento.idMEDICAMENTO
                            )
                          }
                        >
                          🗑️ Eliminar
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>

  )

}

export default AdminMedicamentos