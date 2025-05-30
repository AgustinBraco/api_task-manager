import dotenv from 'dotenv'

dotenv.config()

const environment = {
  PORT: process.env.PORT || 5000,
  ORIGIN_URL: process.env.ORIGIN_URL.split(',').map(url => url.trim('')),
  ENVIRONMENT_URL: process.env.ENVIRONMENT_URL,
  API_KEY: process.env.API_KEY
}

export default environment
