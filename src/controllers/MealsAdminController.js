const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

const sqlConnection = require('../database/sqlite')

class MealsController {
  async index(req,res) {
  const { search, category } = req.query
  const user_id = req.user.id
  let meals


  if (search) {

     meals = await knex('meals')
    .select('meals.title', 'meals.image', 'meals.description', 'meals.category', 'meals.price', 'ingredients.name as ingredientes')
    .join('ingredients', 'ingredients.meal_id', '=', 'meals.id')
    .where('meals.user_id', user_id)
    .andWhere('meals.category',`${category}`)
    .andWhere(function() {
      this.where('meals.title', 'like', `%${search}%`)
        .orWhere('ingredients.name', 'like', `%${search}%`);
    });

    }


    else {

    meals = await knex('meals')
      .where('user_id', Number(user_id))
      .whereLike('category', `%${category}%`)
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
    const response = req.body.meal
    const meal = JSON.parse(response)
    const mealImageFilename = req.file.filename
    const user_id = req.user.id
    const diskStorage = new DiskStorage()

    const checkMealExists = await knex('meals').where('title', meal.title)
    const mealExists = checkMealExists.length > 0
    

 
    const filename = await diskStorage.saveFile(mealImageFilename) 

    if(!meal || !mealImageFilename){

      throw new AppError('Todos os campos são obritatórios', 500)
    }
    if(mealExists){

      throw new AppError('Esta refeição já existe')
    }
    

    const [meal_id] = await knex('meals').insert({
      title: meal.title,
      image: mealImageFilename,
      user_id, 
      description: meal.description, 
      category: meal.category,
      price: meal.price
    })


    if(meal_id) {
      const ingredientsInsert = meal.ingredients.map(ingredient => {
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
    console.log( {title,  description, category, price, ingredients})
    try {
      const meal = await knex('meals')
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
      console.log(meal)
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