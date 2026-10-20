import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import api from '../services/api'

function Carrito() {

      const navegar = useNavigate()
  const [carrito, setCarrito] = useState([])

  useEffect(() => {

    const carritoGuardado =
      JSON.parse(
        localStorage.getItem('carritoMediApp')
      ) || []

    setCarrito(carritoGuardado)

  }, [])

  const eliminarProducto = (indice) => {

    const nuevoCarrito =
      carrito.filter(
        (_, index) => index !== indice
      )

    setCarrito(nuevoCarrito)

    localStorage.setItem(
      'carritoMediApp',
      JSON.stringify(nuevoCarrito)
    )
  }

  const calcularTotal = () => {

    return carrito.reduce(
      (total, medicamento) =>
        total +
        Number(medicamento.precio) *
        Number(medicamento.cantidad),
      0
    )
  }
  const confirmarPedido = async () => {

  console.log('🟢 Se ejecutó confirmarPedido')

  if (carrito.length === 0) {
    alert('Tu carrito está vacío.')
    return
  }

  const usuario =
    JSON.parse(
      localStorage.getItem('usuarioMediApp')
    )

  console.log(
    '👤 Usuario:',
    usuario
  )

  if (!usuario) {
    alert(
      'Debes iniciar sesión para realizar un pedido.'
    )

    navegar('/login')

    return
  }

  const direccion = prompt(
    'Ingresa la dirección donde deseas recibir el pedido:'
  )

  if (!direccion) {
    alert(
      'La dirección es obligatoria.'
    )

    return
  }

  const referencia =
    prompt(
      'Ingresa una referencia para la entrega (opcional):'
    ) || ''

  const productos =
    carrito.map(
      (medicamento) => ({

        idMedicamento:
          medicamento.idMedicamento,

        cantidad:
          medicamento.cantidad,

        precio:
          Number(
            medicamento.precio
          )

      })
    )

  const total =
    calcularTotal()

  console.log(
    '📦 Datos que se enviarán:',
    {
      idUsuario: usuario.id,
      productos: productos,
      total: total,
      direccion: direccion,
      referencia: referencia
    }
  )

  try {

    console.log(
      '🚀 Enviando pedido al servidor...'
    )

    const respuesta =
      await api.post(
        '/pedidos',
        {
          idUsuario:
            usuario.id,

          productos:
            productos,

          total:
            total,

          direccion:
            direccion,

          referencia:
            referencia
        }
      )

    console.log(
      '✅ Respuesta del servidor:',
      respuesta.data
    )

    alert(
      `✅ Pedido creado correctamente.\n\nNúmero de pedido: #${respuesta.data.idPedido}`
    )

    localStorage.removeItem(
      'carritoMediApp'
    )

    setCarrito([])

    navegar('/pedidos')

  } catch (error) {

    console.error(
      '❌ Error al crear el pedido:',
      error
    )

    console.error(
      'Respuesta del servidor:',
      error.response?.data
    )

    alert(
      error.response?.data?.mensaje ||
      'No se pudo crear el pedido.'
    )

  }

}
  return (

    <div className="min-vh-100 d-flex flex-column">

      <Header />

      <main className="container py-5 flex-grow-1">

        <div className="text-center mb-4">

          <h2 className="text-primary">
            🛒 Mi carrito
          </h2>

          <p className="text-muted">
            Revisa los medicamentos antes de confirmar tu pedido.
          </p>

        </div>

       {carrito.length === 0 ? (

  <div className="text-center">

    <div className="alert alert-info">
      Tu carrito está vacío.
    </div>

    <button
      className="btn btn-primary"
      onClick={() => navegar('/medicamentos')}
    >
      💊 Buscar medicamentos
    </button>

  </div>

) : (

          <>

            <div className="row g-3">

              {carrito.map(
                (medicamento, indice) => (

                  <div
                    className="col-md-6"
                    key={indice}
                  >

                    <div className="card shadow-sm">

                      <div className="card-body">

                        <h5 className="card-title">
                          {medicamento.nombre}
                        </h5>

                        <p className="card-text">
                          {medicamento.descripcion}
                        </p>

                        <p>
                          <strong>
                            Precio:
                          </strong>{' '}
                          $
                          {Number(
                            medicamento.precio
                          ).toLocaleString('es-CO')}
                        </p>

                        <p>
                          <strong>
                            Cantidad:
                          </strong>{' '}
                          {medicamento.cantidad}
                        </p>

                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            eliminarProducto(indice)
                          }
                        >
                          Eliminar
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

            <div className="card shadow mt-4">

              <div className="card-body text-end">

                <h4>
                  Total: $
                  {calcularTotal().toLocaleString(
                    'es-CO'
                  )}
                </h4>

                <button
  type="button"
  className="btn btn-primary mt-2"
  onClick={confirmarPedido}
>
  Confirmar pedido
</button>

              </div>

            </div>

          </>

        )}

      </main>

      <Footer />

    </div>

  )
}

export default Carrito
