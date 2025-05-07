import environment from '../environment/environment.js'
import { readFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const docsData = await readFile(join(__dirname, './docs.json'), 'utf-8')
const docs = JSON.parse(docsData)
docs.server = `${environment.ORIGIN_URL}/api/task-manager`

export default docs
