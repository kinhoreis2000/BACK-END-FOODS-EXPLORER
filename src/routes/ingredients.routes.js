const {Router} = require('express')
const IngredientsController = require('../controllers/IngredientsController')
const ensureAuth = require('../middlewares/ensureAuth.js')

const ingredientsRoutes = Router()

const ingredientsController = new IngredientsController()

ingredientsRoutes.get('/', ensureAuth ,ingredientsController.index)

module.exports = ingredientsRoutes