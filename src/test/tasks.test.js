import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../../backend/src/index.ts'

describe('API de tareas', () => {
  it('crea una tarea nueva con texto válido', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ text: 'Escribir informe' })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.text).toBe('Escribir informe')
    expect(res.body.completed).toBe(false)
  })

  it('rechaza una tarea vacía', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ text: '   ' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toBe('Task text is required')
  })

  it('lista las tareas creadas', async () => {
    const res = await request(app).get('/tasks')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
