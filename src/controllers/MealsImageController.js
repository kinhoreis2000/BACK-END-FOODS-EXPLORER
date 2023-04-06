const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')
const sqlConnection = require('../database/sqlite')

class MealsImageController {

  async create(req,res) {

    const meal_id = req.params.id
    const mealImageFilename = req.file.filename



    const diskStorage = new DiskStorage()

    const meal = await knex('meals')
    .where({id :meal_id})
    .first()

      if(!meal) {
        throw new AppError('Só é possível mudar a refeição se você for adm', 401)
      }
      if(meal.image){
        await diskStorage.deleteFile(meal.image)
      }
      const filename = await diskStorage.saveFile(mealImageFilename)
      
      meal.image = filename

      await knex('meals').update(meal).where({id: meal_id})
      console.log(meal)

    return res.json(meal)
  }

  
}

module.exports = MealsImageController;