import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Registro from './pages/Registro'
import Inicio from './pages/Inicio'
import Medicamentos from './pages/Medicamentos'
import Carrito from './pages/Carrito'
import Pedidos from './pages/Pedidos'
import Perfil from './pages/Perfil'
import Notificaciones from './pages/Notificaciones'
import Soporte from './pages/Soporte'
import AdminMedicamentos from './pages/AdminMedicamentos'
import EditarMedicamento from './pages/EditarMedicamento'
import EliminarMedicamento from './pages/EliminarMedicamento'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Autenticación */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/registro"
          element={<Registro />}
        />

        {/* Pantallas principales */}
        <Route
          path="/"
          element={<Login />}

        />

        <Route
          path="/medicamentos"
          element={<Medicamentos />}
        />

        <Route
          path="/carrito"
          element={<Carrito />}
        />

        <Route
          path="/pedidos"
          element={<Pedidos />}
        />

        <Route
          path="/notificaciones"
          element={<Notificaciones />}
        />

        <Route
          path="/perfil"
          element={<Perfil />}
        />

        <Route
          path="/soporte"
          element={<Soporte />}
        />
<Route
  path="/admin/medicamentos"
  element={<AdminMedicamentos />}
/>
<Route
  path="/admin/medicamentos/editar"
  element={<EditarMedicamento />}
/>
<Route
  path="/admin/medicamentos/eliminar"
  element={<EliminarMedicamento />}
/>
      </Routes>

    </BrowserRouter>

  )
}

export default App