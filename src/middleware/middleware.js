import environment from '../environment/environment.js'

// Response
const errorResponse = (res, field) =>
  res.status(400).json({
    status: 'error',
    message: `Invalid ${field}`
  })

// Middlewares
export const isValidKey = (req, res, next) => {
  const { api_key } = req.headers
  const API_KEY = environment.API_KEY

  api_key !== API_KEY
    ? res.status(401).json({
        status: 'error',
        message: 'Invalid API Key'
      })
    : next()
}

export const isValidID = (req, res, next) => {
  let { id } = req.params
  const isInvalidID = !Number(id) || isNaN(id)
  isInvalidID ? errorResponse(res, 'ID') : next()
}

export const isValidTask = (req, res, next) => {
  const { title, description, date, priority, completed } = req.body

  // Title
  const isInvalidTitle = typeof title !== 'string' || title.trim() === ''
  if (isInvalidTitle) return errorResponse(res, 'title')

  // Description
  const isInvalidDescription =
    typeof description !== 'string' || description.trim() === ''
  if (isInvalidDescription) return errorResponse(res, 'description')

  // Date
  const regex = /^\d{4}-\d{2}-\d{2}$/
  const isInvalidDate = !regex.test(date)
  if (isInvalidDate) return errorResponse(res, 'date')

  // Priority
  const isInvalidPriority = priority !== 0 && priority !== 1 && priority !== 2
  if (isInvalidPriority) return errorResponse(res, 'priority')

  // Completed
  const isInvalidCompleted = completed !== 0 && completed !== 1
  if (isInvalidCompleted) return errorResponse(res, 'completed')

  next()
}
