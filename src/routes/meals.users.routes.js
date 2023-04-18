const {Router} = require('express')
const MealsUsersController = require('../controllers/MealsUsersController')
const ensureAuth = require('../middlewares/ensureAuth.js')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const mealsUsersRoutes = Router()
const upload = multer(uploadConfig.MULTER)
const mealsUsersController = new MealsUsersController()


mealsUsersRoutes.use(ensureAuth)


mealsUsersRoutes.get('/', mealsUsersController.index)



module.exports = mealsUsersRoutes;