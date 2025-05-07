import environment from '../environment/environment.js'
import logger from '../logger/logger.js'

// Response
const errorResponse = (res, response) => res.status(400).json(response)

// Middlewares
export const isValidKey = (req, res, next) => {
  logger.info(`Key middleware receive ${req.method} ${req.originalUrl}`)

  const { api_key } = req.headers
  const API_KEY = environment.API_KEY

  if (api_key !== API_KEY) {
    const response = {
      status: 'error',
      message: 'Invalid API Key'
    }

    logger.warn(`Responded with 401: ${JSON.stringify(response)}`)

    return res.status(401).json(response)
  }

  logger.info(`Key middleware passed`)
  next()
}

export const isValidID = (req, res, next) => {
  logger.info(`ID middleware receive ${req.method} ${req.originalUrl}`)

  let { id } = req.params
  const isInvalidID = !Number(id) || isNaN(id)

  if (isInvalidID) {
    const response = {
      status: 'error',
      message: `Invalid ID`
    }

    logger.warn(`Responded with 400: ${JSON.stringify(response)}`)

    return errorResponse(res, response)
  }

  logger.info(`Key middleware passed`)
  next()
}

export const isValidTask = (req, res, next) => {
  logger.info(`Task middleware receive ${req.method} ${req.originalUrl}`)

  const { title, description, date, priority, completed } = req.body

  // Title
  const isInvalidTitle = typeof title !== 'string' || title.trim() === ''

  if (isInvalidTitle) {
    const response = {
      status: 'error',
      message: `Invalid title`
    }

    logger.warn(`Responded with 400: ${JSON.stringify(response)}`)

    return errorResponse(res, response)
  }

  // Description
  const isInvalidDescription =
    typeof description !== 'string' || description.trim() === ''

  if (isInvalidDescription) {
    const response = {
      status: 'error',
      message: `Invalid description`
    }

    logger.warn(`Responded with 400: ${JSON.stringify(response)}`)

    return errorResponse(res, response)
  }

  // Date
  const regex = /^\d{4}-\d{2}-\d{2}$/
  const isInvalidDate = !regex.test(date)

  if (isInvalidDate) {
    const response = {
      status: 'error',
      message: `Invalid date`
    }

    logger.warn(`Responded with 400: ${JSON.stringify(response)}`)

    return errorResponse(res, response)
  }

  // Priority
  const isInvalidPriority = priority !== 0 && priority !== 1 && priority !== 2

  if (isInvalidPriority) {
    const response = {
      status: 'error',
      message: `Invalid priority`
    }

    logger.warn(`Responded with 400: ${JSON.stringify(response)}`)

    return errorResponse(res, response)
  }

  // Completed
  const isInvalidCompleted = completed !== 0 && completed !== 1

  if (isInvalidCompleted) {
    const response = {
      status: 'error',
      message: `Invalid completed`
    }

    logger.warn(`Responded with 400: ${JSON.stringify(response)}`)

    return errorResponse(res, response)
  }

  logger.info(`Task middleware passed`)
  next()
}
