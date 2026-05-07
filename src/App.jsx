import { useState, useEffect } from 'react'
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor
} from '@dnd-kit/core'
import Column from './components/Column'
import Card from './components/Card'

function App() {
  const [tareas, setTareas] = useState(() => {
    const guardadas = localStorage.getItem("tareas")
    return guardadas ? JSON.parse(guardadas) : [
      { id: 1, titulo: "Diseñar base de datos", descripcion: "Crear tablas SQL", prioridad: "alta", columna: "porHacer" },
      { id: 2, titulo: "Armar dashboard", descripcion: "Power BI con ventas", prioridad: "media", columna: "porHacer" },
      { id: 3, titulo: "Crear componentes", descripcion: "Card y Column en React", prioridad: "baja", columna: "enProgreso" },
      { id: 4, titulo: "Publicar portfolio", descripcion: "Subir a GitHub Pages", prioridad: "alta", columna: "terminado" },
    ]
  })

  const [activeTarea, setActiveTarea] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  const columnas = [
    { id: "porHacer",   titulo: "📋 Por hacer" },
    { id: "enProgreso", titulo: "⚡ En progreso" },
    { id: "terminado",  titulo: "✅ Terminado" },
  ]

  const agregarTarea = (titulo, descripcion, prioridad, columnaId) => {
    const nueva = {
      id: Date.now(),
      titulo,
      descripcion,
      prioridad,
      columna: columnaId,
    }
    setTareas([...tareas, nueva])
  }

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id))
  }

  const moverTarea = (id, nuevaColumna) => {
    setTareas(tareas.map((t) =>
      t.id === id ? { ...t, columna: nuevaColumna } : t
    ))
  }

  const editarTarea = (id, nuevoTitulo, nuevaDescripcion, nuevaPrioridad) => {
    setTareas(tareas.map((t) =>
      t.id === id
        ? { ...t, titulo: nuevoTitulo, descripcion: nuevaDescripcion, prioridad: nuevaPrioridad }
        : t
    ))
  }

  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas))
  }, [tareas])

  const handleDragStart = (event) => {
    const tarea = tareas.find((t) => t.id === event.active.id)
    setActiveTarea(tarea)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveTarea(null)
    if (!over) return
    const columnaDestino = over.id
    const esColumna = columnas.some((c) => c.id === columnaDestino)
    if (esColumna) {
      moverTarea(active.id, columnaDestino)
    }
  }

  return (
    <div>
      <div className="header">
        <span>🖥</span>
        <div>
          <h1>Kanban Board</h1>
          <span>Gestión de proyectos</span>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {columnas.map((col) => (
            <Column
              key={col.id}
              titulo={col.titulo}
              columnaId={col.id}
              tarjetas={tareas.filter((t) => t.columna === col.id)}
              onAgregarTarea={agregarTarea}
              onEliminar={eliminarTarea}
              onMover={moverTarea}
              onEditar={editarTarea}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTarea ? (
            <Card
              id={activeTarea.id}
              titulo={activeTarea.titulo}
              descripcion={activeTarea.descripcion}
              prioridad={activeTarea.prioridad}
              onEliminar={() => {}}
              onEditar={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default App