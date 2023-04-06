const {hash} = require('bcryptjs')
const AppError = require('../utils/AppError')

const sqlConnection = require('../database/sqlite')
class UsersController {
  async create(req,res) {
    const {name, email, password} = req.body

    const database = await sqlConnection()
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])
    if(checkUserExists){
      throw new AppError('Este email já está em uso')
    }
    if(!name || !email ||!password){
      throw new AppError('Todos os campos são obritatórios', 500)
    }
    const hashedPassword = await hash(password, 8)

    await database.run('INSERT INTO users (name, email, password, isadmin) VALUES ( ? , ? , ? ,?)', [name, email, hashedPassword, false])
    return res.status(201).json()
  }

}

module.exports = UsersController;