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

  const [mostrarAyuda, setMostrarAyuda] = useState(false)

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

  const [abrirPrimeraColumna, setAbrirPrimeraColumna] = useState(false)

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
      <div className="header-text">
        <h1>Kanban Board</h1>
        <span>Gestor de proyectos</span>
      </div>
      <button className="btn-ayuda" onClick={() => setMostrarAyuda(true)}>?</button>
    </div>

    {mostrarAyuda && (
      <div className="modal-overlay" onClick={() => setMostrarAyuda(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>¿Cómo usar el Kanban?</h2>
            <button className="modal-cerrar" onClick={() => setMostrarAyuda(false)}>✕</button>
          </div>

          <div className="bienvenida-pasos">
            <div className="paso">
              <div className="paso-numero">1</div>
              <div className="paso-icono">➕</div>
              <h3>Creá una tarea</h3>
              <p>Agregá tareas para dividir tu proyecto en objetivos claros. Asignales prioridad <span className="dot rojo"></span> Alta, <span className="dot amarillo"></span> Media o <span className="dot verde"></span> Baja.</p>
            </div>
            <div className="paso">
              <div className="paso-numero">2</div>
              <div className="paso-icono">⟺</div>
              <h3>Arrastrá las tarjetas</h3>
              <p>Mové cada tarea entre:<br/>📋 Por hacer<br/>⚡ En progreso<br/>✅ Terminado<br/>según el estado actual del trabajo.</p>
            </div>
            <div className="paso">
              <div className="paso-numero">3</div>
              <div className="paso-icono">✏️</div>
              <h3>Editá o eliminá</h3>
              <p>Modificá la información de tus tareas o eliminalas en cualquier momento.</p>
            </div>
          </div>

          <button className="btn-confirmar" onClick={() => setMostrarAyuda(false)}>
            ¡Entendido!
          </button>
        </div>
      </div>
    )}

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
            abrirForm={abrirPrimeraColumna && col.id === "porHacer"}
            onFormCerrado={() => setAbrirPrimeraColumna(false)}
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