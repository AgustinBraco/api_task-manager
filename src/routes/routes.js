import express from 'express'
import { isValidKey, isValidID, isValidTask } from '../middleware/middleware.js'
import Task from '../DAO/dao.js'
import logger from '../logger/logger.js'
import swaggerUi from 'swagger-ui-express'
import docs from '../docs/docs.js'

const router = express.Router()
const task = new Task()

// Responses
const handleResponse = (res, error, response) => {
  if (error) {
    const sendResponse = {
      status: error.status,
      message: error.message
    }

    logger.error(
      `Responded with ${error.code}: ${JSON.stringify(sendResponse)}`
    )

    return res.status(error.code).json(sendResponse)
  }

  const sendResponse = {
    status: response.status,
    message: response.message,
    data: response.data
  }

  logger.info(
    `Responded with ${response.code}: ${JSON.stringify(sendResponse)}`
  )

  return res.status(response.code).json(sendResponse)
}

const handleError = (res, error) => {
  const response = {
    status: 'error',
    message: 'Internal sserver error',
    error: error.message
  }

  logger.error(`Responded with 500: ${JSON.stringify(response)}`)

  res.status(500).json(response)
}

// Docs
// router.use('/docs', isValidKey, swaggerUi.serve, swaggerUi.setup(docs))
router.use('/docs', swaggerUi.serve, swaggerUi.setup(docs))

// Routes
router.get('/isalive', (req, res) => {
  try {
    logger.info('GET /api/task-manager/isalive received')

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
    logger.info('GET /api/task-manager received')

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
    logger.info('POST /api/task-manager received')

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
    logger.info('PUT /api/task-manager received')

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
    const { id } = req.params

    logger.info(`DELETE /api/task-manager/${id} received`)

    let response, error

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
