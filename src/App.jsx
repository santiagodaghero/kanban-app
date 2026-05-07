import { useState, useEffect } from 'react'
import Column from './components/Column'

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

  return (
  <div>
    <div className="header">
      <span>🖥</span>
      <div>
        <h1>Kanban Board</h1>
        <span>Gestión de proyectos</span>
      </div>
    </div>
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
  </div>
)

}

export default App