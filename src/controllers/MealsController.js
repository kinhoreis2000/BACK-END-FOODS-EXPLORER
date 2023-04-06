const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

const sqlConnection = require('../database/sqlite')

class MealsController {
  async index(req,res) {
  const { title, ingredients } = req.query
  const user_id = req.user.id
  let meals
  if (ingredients) {
    const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim())

    meals =  await knex('meals')
  .select([
    'meals.id',
    'meals.title',
    'meals.user_id',
  ])
  .where('meals.user_id', Number(user_id) )
  .whereLike('meals.title', `%${title}%` )
  .whereIn('meals.id', function() {
    this.select('meal_id')
        .from('ingredients')
        .whereIn('name', filterIngredients)
        .groupBy('meal_id')
  })
  .orderBy('meals.title')

  } else {
    meals = await knex('meals')
      .where('user_id', Number(user_id))
      .whereLike('title', `%${title}%`)
      .orderBy('title')
    
  }
  const userIngredients = await knex('ingredients').where({ user_id })

  const mealsWithIngredients = meals.map(meal => {
    const mealIngredient = userIngredients.filter(ingredient => ingredient.meal_id === meal.id)
    return {
      ...meal,
      ingredients: mealIngredient
    }
  })
  return res.json(mealsWithIngredients)
}


  async create(req,res) {
    const {title, image,  description, category, price, ingredients} = req.body
    console.log(req.file)
    const mealImageFilename = req.file.filename
    

    const diskStorage = new DiskStorage()
    const user_id = req.user.id
    const database = await sqlConnection()

    if(image){
      await diskStorage.deleteFile(image)
    }
    const filename = await diskStorage.saveFile(mealImageFilename)

    const checkMealExists = await database.get('SELECT * FROM meals WHERE title = (?)', [title])
    if(!title || !image ||!description||!category||!price){
      throw new AppError('Todos os campos são obritatórios', 500)
    }
    if(checkMealExists){
      throw new AppError('Esta refeição já existe')
    }
    
  
    
    const [meal_id] = await knex('meals').insert({
      title,
      image,
      user_id, 
      description, 
      category,
      price
    })
    if(meal_id) {
      const ingredientsInsert = ingredients.map(ingredient => {
        return{
          user_id : Number(user_id),
          meal_id,
          name :ingredient
        }
      })
      await knex('ingredients').insert(ingredientsInsert)
  
    } else {
      console.log('A refeição não foi inserida corretamente')
    }



    return res.status(201).json()
  }

  async update(req,res) {
    const {title,  description, category, price, ingredients} = req.body
    const {id} = req.params
    const user_id = req.user.id
  
    try {
      await knex('meals')
        .where({ id })
        .update({ title, description, category, price });
      
      await knex('ingredients')
        .where({ meal_id: Number(id) })
        .delete();
  
      for (let i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        await knex('ingredients').insert({
          name: ingredient,
          meal_id: Number(id),
          user_id
        });
      }
  
      return res.json();
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: 'Failed to update meal.' });
    }
  }
  






  async show(req,res) {
    
    const {id} = req.params
    const meal = await knex("meals").where({id}).first()
    const ingredients = await knex('ingredients').where({meal_id : Number(meal.id)}).orderBy('name')

    return res.json({
      ...meal,
      ingredients: ingredients
    })

  }

 
  async delete(req,res) {
    const {id} = req.params
    await knex('meals').where({id: Number(id)}).delete()

    return res.json()

  }
}

module.exports = MealsController;