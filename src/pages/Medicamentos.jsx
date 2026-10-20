import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MedicamentoCard from '../components/MedicamentoCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function Medicamentos() {
  const navegar = useNavigate()
      const agregarAlCarrito = (medicamento) => {

    const carritoActual =
      JSON.parse(
        localStorage.getItem('carritoMediApp')
      ) || []

    carritoActual.push({
      ...medicamento,
      cantidad: 1
    })

    localStorage.setItem(
      'carritoMediApp',
      JSON.stringify(carritoActual)
    )

    alert(
      `${medicamento.nombre} fue agregado al carrito.`
    )
  }

  const [medicamentos, setMedicamentos] = useState([])
  const [mensaje, setMensaje] = useState('Cargando medicamentos...')

  useEffect(() => {

    const cargarMedicamentos = async () => {

      try {

        const respuesta =
          await api.get('/medicamentos')

        console.log(
          'Medicamentos recibidos:',
          respuesta.data
        )

        setMedicamentos(respuesta.data)

        setMensaje('')

      } catch (error) {

        console.error(
          '❌ Error al cargar medicamentos:',
          error
        )

        setMensaje(
          '❌ No se pudieron obtener los medicamentos.'
        )
      }
    }

    cargarMedicamentos()

  }, [])

  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

  <h2 className="text-primary">
    Medicamentos
  </h2>

  <p className="text-muted">
    Busca y selecciona los medicamentos
    que necesitas.
  </p>

  <button
  className="btn btn-outline-primary mt-2"
  onClick={() => navegar('/carrito')}
>
  🛒 Ir al carrito
</button>

</div>

        {mensaje && (
          <div className="alert alert-info text-center">
            {mensaje}
          </div>
        )}

        <div className="row g-4">

          {medicamentos.map((medicamento) => (

            <div
              className="col-md-6"
              key={medicamento.idMEDICAMENTO}
            >

              <div className="card shadow-sm h-100">

                <div className="card-body">

      <MedicamentoCard
  medicamento={{
    idMedicamento: medicamento.idMEDICAMENTO,
    id: medicamento.idMEDICAMENTO,
    nombre: medicamento.Nombre,
    descripcion: medicamento.descripcion,
    precio: medicamento.precio,
    stock: medicamento.stock
  }}
  agregarAlCarrito={agregarAlCarrito}
/>

                </div>

              </div>

            </div>

          ))}

        </div>

      </main>

      <Footer />

    </div>

  )
}

export default Medicamentos