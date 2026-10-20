function MedicamentoCard({ medicamento, agregarAlCarrito }) {

  return (
    <div>

      <h3>
        {medicamento.nombre}
      </h3>

      <p>
        {medicamento.descripcion}
      </p>

      <p>
        <strong>Precio:</strong> $
        {Number(medicamento.precio).toLocaleString('es-CO')}
      </p>

      <p>
        <strong>Disponible:</strong>{' '}
        {medicamento.stock} unidades
      </p>

      <button
        className="btn btn-primary"
        onClick={() => agregarAlCarrito(medicamento)}
        disabled={medicamento.stock <= 0}
      >
        {medicamento.stock > 0
          ? 'Agregar al carrito'
          : 'Agotado'}
      </button>

    </div>
  )
}

export default MedicamentoCard