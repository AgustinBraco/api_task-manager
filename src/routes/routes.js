import express from 'express'
import { isValidKey, isValidID, isValidTask } from '../middleware/middleware.js'
import Task from '../DAO/dao.js'

const router = express.Router()
const task = new Task()

// Responses
const handleResponse = (res, error, response) =>
  error
    ? res.status(error.code).json({
        status: error.status,
        message: error.message,
        error: error.error
      })
    : res.status(response.code).json({
        status: response.status,
        message: response.message,
        data: response.data
      })

const handleError = (res, error) =>
  res.status(500).json({
    status: 'error',
    message: 'Internal sserver error',
    error: error.message
  })

// Routes
router.get('/isAlive', (req, res) => {
  try {
    handleResponse(res, null, {
      code: 200,
      status: 'success',
      message: 'Service running correctly'
    })
  } catch (error) {
    handleError(res, error)
  }
})

router.get('/', isValidKey, async (req, res) => {
  try {
    let response, error

    await task
      .get()
      .then(res => (response = res))
      .catch(err => (error = err))

    handleResponse(res, error, response)
  } catch (error) {
    handleError(res, error)
  }
})

router.post('/', isValidKey, isValidTask, async (req, res) => {
  try {
    let response, error

    const { title, description, date, priority, completed } = req.body

    await task
      .create(title, description, date, priority, completed)
      .then(res => (response = res))
      .catch(err => (error = err))

    handleResponse(res, error, response)
  } catch (error) {
    handleError(res, error)
  }
})

router.put('/:id', isValidKey, isValidID, isValidTask, async (req, res) => {
  try {
    let response, error

    const { id } = req.params
    const { title, description, date, priority, completed } = req.body

    await task
      .update(title, description, date, priority, completed, id)
      .then(res => (response = res))
      .catch(err => (error = err))

    handleResponse(res, error, response)
  } catch (error) {
    handleError(res, error)
  }
})

router.delete('/:id', isValidKey, isValidID, async (req, res) => {
  try {
    let response, error

    const { id } = req.params

    await task
      .delete(id)
      .then(res => (response = res))
      .catch(err => (error = err))

    handleResponse(res, error, response)
  } catch (error) {
    handleError(res, error)
  }
})

export default router
