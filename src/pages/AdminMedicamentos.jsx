import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function AdminMedicamentos() {

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoria, setCategoria] = useState('1')
  const [mensaje, setMensaje] = useState('')

  const crearMedicamento = async (evento) => {

    evento.preventDefault()

    setMensaje('')

    try {

      const respuesta = await api.post(
        '/medicamentos',
        {
          nombre: nombre,
          descripcion: descripcion,
          precio: Number(precio),
          stock: Number(stock),
          categoria: Number(categoria)
        }
      )

      console.log(
        '✅ Medicamento creado:',
        respuesta.data
      )

      setMensaje(
        '✅ Medicamento creado correctamente.'
      )

      setNombre('')
      setDescripcion('')
      setPrecio('')
      setStock('')
      setCategoria('1')

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

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            ⚙️ Administrar medicamentos
          </h2>

          <p className="text-muted">
            Registrar un nuevo medicamento en MediApp.
          </p>

        </div>

        <div
          className="card shadow-sm mx-auto"
          style={{ maxWidth: '600px' }}
        >

          <div className="card-body">

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
                  placeholder="Ejemplo: Ibuprofeno"
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
                  placeholder="Ejemplo: Analgésico"
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

export default AdminMedicamentos