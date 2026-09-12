import { describe, it, expect } from 'vitest'
import { esCorreoValido, contarTareasPendientes } from './validaciones'

describe('esCorreoValido', () => {
  it('acepta un correo con formato válido', () => {
    expect(esCorreoValido('ana@ejemplo.com')).toBe(true)
  })

  it('rechaza un correo sin arroba', () => {
    expect(esCorreoValido('ana-ejemplo.com')).toBe(false)
  })
})

describe('contarTareasPendientes', () => {
  it('cuenta solo las tareas no completadas', () => {
    const tareas = [
      { completada: true },
      { completada: false },
      { completada: false },
    ]
    expect(contarTareasPendientes(tareas)).toBe(2)
  })

  it('devuelve 0 cuando la lista está vacía', () => {
    expect(contarTareasPendientes([])).toBe(0)
  })
})