import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const tasksData = await readFile(join(__dirname, './tasks.json'), 'utf-8')
const tasks = JSON.parse(tasksData)

export default tasks
