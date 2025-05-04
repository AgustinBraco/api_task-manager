import database from '../database/database.js'

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
  message: `Task with ID ${id} not found`,
  error: 'NOT FOUND'
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
      database.all(query, [], (error, tasks) =>
        error
          ? reject(queryResponse(error))
          : resolve(successResponse('Tasks retrieved successfully', tasks))
      )
    })
  }

  create(title, description, date, priority, completed) {
    const query = `INSERT INTO tasks (title, description, date, priority, completed) VALUES (?, ?, ?, ?, ?)`

    return new Promise((resolve, reject) => {
      database.run(
        query,
        [title, description, date, priority, completed],
        function (error) {
          if (error) return reject(queryResponse(error))

          database.get(
            'SELECT * FROM tasks WHERE id = ?',
            [this.lastID],
            (error, task) =>
              error
                ? reject(queryResponse(error))
                : resolve(successResponse('Task created successfully', task))
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
          if (error) return reject(queryResponse(error))

          if (this.changes <= 0) return reject(notFoundResponse(id))

          database.get(
            'SELECT * FROM tasks WHERE id = ?',
            [id],
            (error, task) =>
              error
                ? reject(queryResponse(error))
                : resolve(successResponse('Task updated successfully', task))
          )
        }
      )
    })
  }

  delete(id) {
    const query = `DELETE FROM tasks WHERE id = ?`

    return new Promise((resolve, reject) => {
      database.run(query, [id], function (error) {
        if (error) return reject(queryResponse(error))

        if (this.changes <= 0) return reject(notFoundResponse(id))

        return resolve(successResponse('Task deleted successfully', []))
      })
    })
  }
}

export default Task
