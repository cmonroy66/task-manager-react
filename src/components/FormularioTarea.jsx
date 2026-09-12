import { useState } from 'react'

export default function FormularioTarea({ onAgregar }) {
  const [titulo, setTitulo] = useState('')

  function manejarEnvio(evento) {
    evento.preventDefault()
    if (titulo.trim()) {
      onAgregar(titulo)
      setTitulo('')
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      <label htmlFor='titulo-tarea'>Nueva tarea</label>
      <input
        id='titulo-tarea'
        value={titulo}
        onChange={(evento) => setTitulo(evento.target.value)}
      />
      <button type='submit'>Agregar</button>
    </form>
  )
}