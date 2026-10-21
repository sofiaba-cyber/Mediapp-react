import { Link, useNavigate } from 'react-router-dom'

function Header() {

  const navegar = useNavigate()

  const cerrarSesion = () => {

    localStorage.removeItem(
      'usuarioMediApp'
    )

    navegar('/login')
  }

  return (

    <header className="bg-primary text-white">

      <div className="container py-3">

        <div className="d-flex justify-content-between align-items-center flex-wrap">

          <div>

            <Link
              to="/"
              className="text-white text-decoration-none"
            >

              <h1 className="h3 mb-1">
                💊 MediApp
              </h1>

            </Link>

            <p className="mb-0">
              Entrega de medicamentos a domicilio
            </p>

          </div>

          <nav className="mt-3 mt-md-0">

            <Link
              to="/"
              className="btn btn-light btn-sm me-1 mb-1"
            >
              🏠 Inicio
            </Link>

            <Link
              to="/medicamentos"
              className="btn btn-light btn-sm me-1 mb-1"
            >
              💊 Medicamentos
            </Link>

            <Link
              to="/carrito"
              className="btn btn-light btn-sm me-1 mb-1"
            >
              🛒 Carrito
            </Link>

            <Link
              to="/pedidos"
              className="btn btn-light btn-sm me-1 mb-1"
            >
              📦 Pedidos
            </Link>

            <Link
              to="/notificaciones"
              className="btn btn-light btn-sm me-1 mb-1"
            >
              🔔 Notificaciones
            </Link>
            <Link
  to="/soporte"
  className="btn btn-light btn-sm me-1 mb-1"
>
  📞 Soporte
</Link>

            <Link
              to="/perfil"
              className="btn btn-light btn-sm me-1 mb-1"
            >
              👤 Perfil
            </Link>
            <Link
  to="/admin/medicamentos"
  className="btn btn-warning btn-sm me-1 mb-1"
>
  ⚙️ Administración
</Link>

            <button
              className="btn btn-danger btn-sm mb-1"
              onClick={cerrarSesion}
            >
              🚪 Salir
            </button>

          </nav>

        </div>

      </div>

    </header>

  )
}

export default Header