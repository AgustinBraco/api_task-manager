import sqlite3 from 'sqlite3'

sqlite3.verbose()

// Create database
const database = new sqlite3.Database(':memory:', error => {
  if (error) return console.log('Error creating database:', error.message)

  console.log('Database created successfully')

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
        return console.log('Error creating table "tasks":', error.message)

      console.log('Table "tasks" created')
    }
  )
})

export default database
