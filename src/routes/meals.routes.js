const {Router} = require('express')
const MealsController = require('../controllers/MealsController')
const MealsImageController = require('../controllers/MealsImageController')
const ensureAuth = require('../middlewares/ensureAuth.js')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const mealsRoutes = Router()
const upload = multer(uploadConfig.MULTER)
const mealsController = new MealsController()
const mealsImageController = new MealsImageController()


mealsRoutes.use(ensureAuth)

mealsRoutes.post('/', upload.single('image'),mealsController.create)
mealsRoutes.put('/:id', mealsController.update)
mealsRoutes.get('/:id', mealsController.show)
mealsRoutes.get('/', mealsController.index)
mealsRoutes.delete('/:id', mealsController.delete)
mealsRoutes.patch('/image/:id',upload.single('image'), mealsImageController.create )

module.exports = mealsRoutes