require('express-async-errors')
require('dotenv/config')
const AppError = require('./utils/AppError')
const uploadConfig = require('./configs/upload')
const express = require('express')

const cors = require('cors')
const routes = require('./routes')

const app = express()
app.use(cors())

app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error('🔥 Erro inesperado:', error)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = process.env.SERVER_PORT || 5000
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
