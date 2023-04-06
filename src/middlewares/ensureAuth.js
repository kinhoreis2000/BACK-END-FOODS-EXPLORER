const {verify} = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuth(req,res,next) {
  
  const authHeader = req.headers.authorization
  
  if(!authHeader) {
    throw new AppError('JWT token inválido', 401)
  }

  const [,token] = authHeader.split(' ')

  try {
    const tokenVerificed =verify(token, authConfig.jwt.secret)
    const user_id = tokenVerificed.sub
    req.user = {
      id: Number(user_id),

    }

    return next()

  } catch{


    throw new AppError('JWT token inválido', 401)

  }
}

module.exports = ensureAuth