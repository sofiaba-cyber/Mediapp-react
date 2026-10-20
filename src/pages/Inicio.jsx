import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Inicio() {
    const navegar = useNavigate()
  return (
    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container flex-grow-1 py-5">

        <div className="row align-items-center">

          <div className="col-md-7">

            <h2 className="display-5 fw-bold text-primary">
              Bienvenido a MediApp
            </h2>

            <p className="lead mt-3">
              Encuentra tus medicamentos y solicita
              su entrega a domicilio de forma fácil,
              rápida y segura.
            </p>

            <div className="mt-4">

             <button
  className="btn btn-primary me-2"
  onClick={() => navegar('/medicamentos')}
>
  Buscar medicamentos
</button>

             <button
  className="btn btn-outline-primary"
  onClick={() => navegar('/pedidos')}
>
  Ver mis pedidos
</button>
            </div>

          </div>

          <div className="col-md-5 text-center mt-4 mt-md-0">

            <div className="card shadow p-4">

              <div className="display-1">
                💊
              </div>

              <h3 className="mt-3">
                Tus medicamentos
              </h3>

              <p className="text-muted">
                Solicita tu pedido y recíbelo
                directamente en tu domicilio.
              </p>

            </div>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default Inicio