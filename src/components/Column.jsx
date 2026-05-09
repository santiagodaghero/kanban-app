import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import Card from './Card'

function Column({ titulo, tarjetas, columnaId, onAgregarTarea, onEliminar, onEditar, onMover, abrirForm, onFormCerrado }) {
  const [mostrarFormLocal, setMostrarFormLocal] = useState(false)
  const [nuevoTitulo, setNuevoTitulo] = useState("")
  const [nuevaDescripcion, setNuevaDescripcion] = useState("")
  const [nuevaPrioridad, setNuevaPrioridad] = useState("media")

  const mostrarForm = mostrarFormLocal || abrirForm

  const { setNodeRef, isOver } = useDroppable({ id: columnaId })

  const handleAgregar = () => {
    if (nuevoTitulo.trim() === "") return
    onAgregarTarea(nuevoTitulo, nuevaDescripcion, nuevaPrioridad, columnaId)
    setNuevoTitulo("")
    setNuevaDescripcion("")
    setNuevaPrioridad("media")
    setMostrarFormLocal(false)
    if (abrirForm) onFormCerrado()
  }

  return (
    <div
      ref={setNodeRef}
      className={`column ${isOver ? "drag-over" : ""}`}
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
            columna={tarjeta.columna}
            onEliminar={onEliminar}
            onEditar={onEditar}
            onMover={onMover}
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
            <button className="btn-cancelar" onClick={() => {
              setMostrarFormLocal(false)
              if (abrirForm) onFormCerrado()
            }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <button className="btn-agregar" onClick={() => setMostrarFormLocal(true)}>+ Agregar tarea</button>
      )}
    </div>
  )
}

export default Column