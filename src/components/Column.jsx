import { useState } from 'react'
import Card from './Card'

function Column({ titulo, tarjetas, columnaId, onAgregarTarea, onEliminar, onMover, onEditar}) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevoTitulo, setNuevoTitulo] = useState("")
  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [nuevaPrioridad, setNuevaPrioridad] = useState("media")

  const handleAgregar = () => {
    if (nuevoTitulo.trim() === "") return
    onAgregarTarea(nuevoTitulo, nuevaDescripcion, nuevaPrioridad, columnaId)
    setNuevoTitulo("")
    setNuevaDescripcion("")
    setNuevaPrioridad("media")
    setMostrarForm(false)
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    const id = Number(e.dataTransfer.getData("id"))
    onMover(id, columnaId)
  }

return (
  <div
    className="column"
    onDragOver={handleDragOver}
    onDrop={handleDrop}
  >
    <div className="column-header">
      <h2>{titulo}</h2>
      <span className="column-count">{tarjetas.length}</span>
    </div>
    <div className="cards-container">
      {tarjetas.map((tarjeta) => (
        <Card
            key={tarjeta.id}
            id={tarjeta.id}
            titulo={tarjeta.titulo}
            descripcion={tarjeta.descripcion}
            prioridad={tarjeta.prioridad}
            onEliminar={onEliminar}
            onEditar={onEditar}
        />
      ))}
    </div>

    {mostrarForm ? (
      <div className="form-nueva-tarea">
        <input
          type="text"
          placeholder="Título de la tarea..."
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
        />
        <textarea
          rows={2}
          placeholder="Descripción (opcional)..."
          value={nuevaDescripcion}
          onChange={(e) => setNuevaDescripcion(e.target.value)}
        />
        <select
          value={nuevaPrioridad}
          onChange={(e) => setNuevaPrioridad(e.target.value)}
        >
          <option value="alta">🔴 Alta</option>
          <option value="media">🟡 Media</option>
          <option value="baja">🟢 Baja</option>
        </select>
        <div className="form-buttons">
          <button className="btn-confirmar" onClick={handleAgregar}>Agregar</button>
          <button className="btn-cancelar" onClick={() => setMostrarForm(false)}>Cancelar</button>
        </div>
      </div>
    ) : (
      <button className="btn-agregar" onClick={() => setMostrarForm(true)}>+ Agregar tarea</button>
    )}
  </div>
)

}

export default Column