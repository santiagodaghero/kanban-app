import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

function Card({ id, titulo, descripcion, prioridad, onEliminar, onEditar }) {
  const [editando, setEditando] = useState(false)
  const [editTitulo, setEditTitulo] = useState(titulo)
  const [editDescripcion, setEditDescripcion] = useState(descripcion)
  const [editPrioridad, setEditPrioridad] = useState(prioridad)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  }

  const prioridadLabel = {
    alta: "🔴 Alta",
    media: "🟡 Media",
    baja: "🟢 Baja"
  }

  const handleGuardar = () => {
    if (editTitulo.trim() === "") return
    onEditar(id, editTitulo, editDescripcion, editPrioridad)
    setEditando(false)
  }

  if (editando) {
    return (
      <div className={`card ${prioridad}`}>
        <div className="form-nueva-tarea">
          <input
            type="text"
            value={editTitulo}
            onChange={(e) => setEditTitulo(e.target.value)}
          />
          <textarea
            rows={2}
            value={editDescripcion}
            onChange={(e) => setEditDescripcion(e.target.value)}
          />
          <select
            value={editPrioridad}
            onChange={(e) => setEditPrioridad(e.target.value)}
          >
            <option value="alta">🔴 Alta</option>
            <option value="media">🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
          <div className="form-buttons">
            <button className="btn-confirmar" onClick={handleGuardar}>💾 Guardar</button>
            <button className="btn-cancelar" onClick={() => setEditando(false)}>Cancelar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card ${prioridad}`}
      {...listeners}
      {...attributes}
    >
      <span className={`prioridad ${prioridad}`}>{prioridadLabel[prioridad]}</span>
      <h3>{titulo}</h3>
      <p>{descripcion}</p>
      <div className="card-actions">
        <button className="btn-edit" onClick={(e) => { e.stopPropagation(); setEditando(true) }}>✏️</button>
        <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onEliminar(id) }}>🗑</button>
      </div>
    </div>
  )
}

export default Card