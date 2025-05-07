import database from '../database/database.js'
import logger from '../logger/logger.js'

// Responses
const queryResponse = error => ({
  code: 500,
  status: 'error',
  message: 'Error querying the database',
  error: error.code
})

const notFoundResponse = id => ({
  code: 404,
  status: 'error',
  message: `Task with ID ${id} not found`
})

const successResponse = (message, data) => ({
  code: 200,
  status: 'success',
  message,
  data
})

// Querys
class Task {
  get() {
    const query = 'SELECT * FROM tasks'

    return new Promise((resolve, reject) => {
      database.all(query, [], (error, tasks) => {
        if (error) {
          logger.error(`Error querying the database ${error.code}`)
          return reject(queryResponse(error))
        }

        logger.info(`Tasks retrieved successfully`)
        return resolve(successResponse('Tasks retrieved successfully', tasks))
      })
    })
  }

  create(title, description, date, priority, completed) {
    const query = `INSERT INTO tasks (title, description, date, priority, completed) VALUES (?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
      database.run(
        query,
        [title, description, date, priority, completed],
        function (error) {
          if (error) {
            logger.error(`Error querying the database ${error.code}`)
            return reject(queryResponse(error))
          }

          database.get(
            'SELECT * FROM tasks WHERE id = ?',
            [this.lastID],
            (error, task) => {
              if (error) {
                logger.error(`Error querying the database ${error.code}`)
                return reject(queryResponse(error))
              }

              logger.info(`Task created successfully`)
              return resolve(successResponse('Task created successfully', task))
            }
          )
        }
      )
    })
  }

  update(title, description, date, priority, completed, id) {
    const query = `UPDATE tasks SET title = ?, description = ?, date = ?, priority = ?, completed = ? WHERE id = ?`

    return new Promise((resolve, reject) => {
      database.run(
        query,
        [title, description, date, priority, completed, id],
        function (error) {
          if (error) {
            logger.error(`Error querying the database ${error.code}`)
            return reject(queryResponse(error))
          }

          if (this.changes <= 0) {
            logger.error(`Task not found in database`)
            return reject(notFoundResponse(id))
          }

          database.get(
            'SELECT * FROM tasks WHERE id = ?',
            [id],
            (error, task) => {
              if (error) {
                logger.error(`Error querying the database ${error.code}`)
                return reject(queryResponse(error))
              }

              logger.info(`Task updated successfully`)
              return resolve(successResponse('Task updated successfully', task))
            }
          )
        }
      )
    })
  }

  delete(id) {
    const query = `DELETE FROM tasks WHERE id = ?`

    return new Promise((resolve, reject) => {
      database.run(query, [id], function (error) {
        if (error) {
          logger.error(`Error querying the database ${error.code}`)
          return reject(queryResponse(error))
        }

        if (this.changes <= 0) {
          logger.error(`Task not found in database`)
          return reject(notFoundResponse(id))
        }

        logger.error(`Task deleted successfully`)
        return resolve(successResponse('Task deleted successfully', []))
      })
    })
  }
}

export default Task
