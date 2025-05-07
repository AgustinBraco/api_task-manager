import sqlite3 from 'sqlite3'
import logger from '../logger/logger.js'

sqlite3.verbose()

// Create database
const database = new sqlite3.Database(':memory:', error => {
  if (error) return logger.error(`Error creating database: ${error.message}`)

  logger.info('Database created successfully')

  // Create table
  database.run(
    `CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    priority INTEGER NOT NULL,
    completed BOOLEAN DEFAULT 0
  )`,
    error => {
      if (error)
        return logger.error(`Error creating table "tasks": ${error.message}`)

      logger.info('Table "tasks" created')
    }
  )
})

export default database
