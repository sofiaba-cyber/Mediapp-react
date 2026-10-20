function PedidoCard({ pedido }) {
  return (
    <div>

      <h3>
        Pedido #{pedido.id}
      </h3>

      <p>
        Fecha: {pedido.fecha}
      </p>

      <p>
        Medicamento: {pedido.medicamento}
      </p>

      <p>
        Cantidad: {pedido.cantidad}
      </p>

      <p>
        Total: ${pedido.total}
      </p>

      <p>
        Estado: <strong>{pedido.estado}</strong>
      </p>

      <button>
        Ver detalle
      </button>

    </div>
  )
}

export default PedidoCard