import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function Pedidos() {

  const [pedidos, setPedidos] = useState([])
  const [mensaje, setMensaje] = useState(
    'Cargando pedidos...'
  )

  useEffect(() => {

    const cargarPedidos = async () => {

      try {

        const usuario =
          JSON.parse(
            localStorage.getItem('usuarioMediApp')
          )

        if (!usuario) {
          setMensaje(
            'Debes iniciar sesión para ver tus pedidos.'
          )
          return
        }

        const respuesta =
          await api.get(
            `/pedidos/${usuario.id}`
          )

        console.log(
          'Pedidos recibidos:',
          respuesta.data
        )

        setPedidos(
          respuesta.data
        )

        setMensaje('')

      } catch (error) {

        console.error(
          '❌ Error al cargar pedidos:',
          error
        )

        setMensaje(
          '❌ No se pudieron cargar los pedidos.'
        )

      }

    }

    cargarPedidos()

  }, [])

  const eliminarPedido = async (idPedido) => {

    

  const confirmar = window.confirm(
    '¿Estás seguro de que deseas eliminar este pedido?'
  )

  if (!confirmar) return

  try {

    await api.delete(`/pedidos/${idPedido}`)

    // Actualizar la lista sin recargar la página
    setPedidos(
      pedidos.filter(
        pedido => pedido.idPEDIDO !== idPedido
      )
    )

    alert('✅ Pedido eliminado correctamente.')

  } catch (error) {

    console.error(
      '❌ Error al eliminar pedido:',
      error
    )

    alert(
      error.response?.data?.mensaje ||
      '❌ No se pudo eliminar el pedido.'
    )

  }
}
const cambiarEstado = async (idPedido, nuevoEstado) => {

  try {

    await api.put(
      `/pedidos/${idPedido}/estado`,
      {
        estado: nuevoEstado
      }
    )

    setPedidos(
      pedidos.map(pedido =>
        pedido.idPEDIDO === idPedido
          ? { ...pedido, Estado: nuevoEstado }
          : pedido
      )
    )

    alert('✅ Estado actualizado correctamente.')

  } catch (error) {

    console.error(
      '❌ Error al cambiar estado:',
      error
    )

    alert(
      error.response?.data?.mensaje ||
      '❌ No se pudo cambiar el estado.'
    )

  }
}
  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            📦 Mis pedidos
          </h2>

          <p className="text-muted">
            Consulta el estado de tus pedidos.
          </p>

        </div>

        {mensaje && (
          <div className="alert alert-info text-center">
            {mensaje}
          </div>
        )}

        <div className="row g-4">

          {pedidos.map((pedido) => (

            <div
              className="col-md-6"
              key={pedido.idPEDIDO}
            >

              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="card-title">
                    Pedido #{pedido.idPEDIDO}
                  </h5>

                  <p>
                    <strong>Fecha:</strong>{' '}
                    {pedido.Fecha}
                  </p>

                  <p>
                    <strong>Medicamento:</strong>{' '}
                    {pedido.medicamento}
                  </p>

                  <p>
                    <strong>Cantidad:</strong>{' '}
                    {pedido.cantidad}
                  </p>

                  <p>
                    <strong>Total:</strong>{' '}
                    $
                    {Number(
                      pedido.Total
                    ).toLocaleString('es-CO')}
                  </p>

                  <p>
                    <strong>Estado:</strong>{' '}

                    <span className="badge bg-primary">
                      {pedido.Estado}
                    </span>

                  </p>

                  <select
  className="form-select mt-2"
  value={pedido.Estado}
  onChange={(e) =>
    cambiarEstado(
      pedido.idPEDIDO,
      e.target.value
    )
  }
>
  <option value="En proceso">
    En proceso
  </option>

  <option value="En camino">
    En camino
  </option>

  <option value="Entregado">
    Entregado
  </option>
</select>

                  <p>
                    <strong>Dirección:</strong>{' '}
                    {pedido.direccion}
                  </p>
<button
  className="btn btn-danger mt-3"
  onClick={() => eliminarPedido(pedido.idPEDIDO)}
>
  🗑️ Eliminar pedido
</button>

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

export default Pedidos