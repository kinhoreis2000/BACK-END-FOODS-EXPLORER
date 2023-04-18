const {Router} = require('express')
const MealsAdminController = require('../controllers/MealsAdminController')
const MealsImageController = require('../controllers/MealsImageController')
const ensureAuth = require('../middlewares/ensureAuth.js')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const mealsAdminRoutes = Router()
const upload = multer(uploadConfig.MULTER)
const mealsAdminController = new MealsAdminController()
const mealsImageController = new MealsImageController()


mealsAdminRoutes.use(ensureAuth)

mealsAdminRoutes.post('/', upload.single('image'),mealsAdminController.create)
mealsAdminRoutes.put('/:id', mealsAdminController.update)
mealsAdminRoutes.get('/:id', mealsAdminController.show)
mealsAdminRoutes.get('/', mealsAdminController.index)
mealsAdminRoutes.delete('/:id', mealsAdminController.delete)
mealsAdminRoutes.patch('/image/:id',upload.single('image'), mealsImageController.create )



module.exports = mealsAdminRoutes;