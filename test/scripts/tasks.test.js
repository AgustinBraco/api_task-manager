import request from 'supertest'
import { app, server } from '../../src/index.js'
import environment from '../../src/environment/environment.js'
import tasks from '../data/data.js'

// Close terminal
afterAll(done => {
  server.close(done)
})

// Tests
describe('Is alive', () => {
  it('200 - Running', async () => {
    const response = await request(app).get('/api/task-manager/isAlive')

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Service running correctly')
  })
})

describe('Read', () => {
  it('200 - Valid', async () => {
    const response = await request(app)
      .get('/api/task-manager')
      .set('API_KEY', environment.API_KEY)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Tasks retrieved successfully')
  })

  it('401 - Invalid key', async () => {
    const response = await request(app)
      .get('/api/task-manager')
      .set('API_KEY', tasks.invalidKey)

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toEqual('Invalid API Key')
  })
})

describe('Create', () => {
  it('200 - Valid', async () => {
    const response = await request(app)
      .post('/api/task-manager')
      .set('API_KEY', environment.API_KEY)
      .send(tasks.valid)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Task created successfully')
  })

  it('400 - Invalid body', async () => {
    const response = await request(app)
      .post('/api/task-manager')
      .set('API_KEY', environment.API_KEY)
      .send(tasks.invalid)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Invalid description')
  })

  it('401 - Invalid key', async () => {
    const response = await request(app)
      .post('/api/task-manager')
      .set('API_KEY', tasks.invalidKey)
      .send(tasks.valid)

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toEqual('Invalid API Key')
  })
})

describe('Update', () => {
  it('200 - Valid', async () => {
    const response = await request(app)
      .put(`/api/task-manager/${tasks.validID}`)
      .set('API_KEY', environment.API_KEY)
      .send(tasks.valid)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Task updated successfully')
  })

  it('400 - Invalid ID', async () => {
    const response = await request(app)
      .put(`/api/task-manager/${tasks.invalidID}`)
      .set('API_KEY', environment.API_KEY)
      .send(tasks.valid)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Invalid ID')
  })

  it('400 - Invalid body', async () => {
    const response = await request(app)
      .put(`/api/task-manager/${tasks.validID}`)
      .set('API_KEY', environment.API_KEY)
      .send(tasks.invalid)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Invalid description')
  })

  it('401 - Invalid key', async () => {
    const response = await request(app)
      .put(`/api/task-manager/${tasks.validID}`)
      .set('API_KEY', tasks.invalidKey)
      .send(tasks.valid)

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toEqual('Invalid API Key')
  })

  it('404 - Not found', async () => {
    const response = await request(app)
      .put(`/api/task-manager/${tasks.incorrectID}`)
      .set('API_KEY', environment.API_KEY)
      .send(tasks.valid)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toEqual(
      `Task with ID ${tasks.incorrectID} not found`
    )
  })
})

describe('Delete', () => {
  it('200 - Valid', async () => {
    const response = await request(app)
      .delete(`/api/task-manager/${tasks.validID}`)
      .set('API_KEY', environment.API_KEY)

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('Task deleted successfully')
  })

  it('400 - Invalid ID', async () => {
    const response = await request(app)
      .delete(`/api/task-manager/${tasks.invalidID}`)
      .set('API_KEY', environment.API_KEY)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Invalid ID')
  })

  it('401 - Invalid key', async () => {
    const response = await request(app)
      .delete(`/api/task-manager/${tasks.validID}`)
      .set('API_KEY', tasks.invalidKey)

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toEqual('Invalid API Key')
  })

  it('404 - Not found', async () => {
    const response = await request(app)
      .delete(`/api/task-manager/${tasks.incorrectID}`)
      .set('API_KEY', environment.API_KEY)

    expect(response.statusCode).toBe(404)
    expect(response.body.message).toEqual(
      `Task with ID ${tasks.incorrectID} not found`
    )
  })
})
