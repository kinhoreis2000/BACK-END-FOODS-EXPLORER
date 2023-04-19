const AppError = require('../utils/AppError')
const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

const sqlConnection = require('../database/sqlite')

class MealsUsersController {
  async index(req,res) {
    
    const { search, category } = req.query
    const Admin_user_id = 1
    let meals


    if (search) {
      meals = await knex('meals')
      .select('meals.id', 'meals.title', 'meals.image', 'meals.description', 'meals.category', 'meals.price', 'ingredients.id as ingredient_id', 'ingredients.name as ingredient_name')
      .join('ingredients', 'ingredients.meal_id', '=', 'meals.id')
        .where(function() {
        this.where('meals.title', 'like', `%${search}%`)
        .orWhere('ingredients.name', 'like', `%${search}%`);
        })
      .where('meals.category', 'like', `%${category}%`)
      .orderBy('meals.title');

      const mealsWithIngredients = meals.reduce((acc, meal) => {
      const mealIndex = acc.findIndex(m => m.id === meal.id);
      const ingredient = { id: meal.ingredient_id, name: meal.ingredient_name };
      if (mealIndex !== -1) {
        acc[mealIndex].ingredients.push(ingredient);
      } else 
      {
        acc.push({
        id: meal.id,
        title: meal.title,
        image: meal.image,
        description: meal.description,
        category: meal.category,
        price: meal.price,
        ingredients: [ingredient]
        });
      }
      return acc;
      }, []);

      return res.json(mealsWithIngredients);

    }
    else 
    {

    meals = await knex('meals')
    .whereLike('category', `%${category}%`)
    .orderBy('title')




    const mealsIngredients = await knex('ingredients')

    const mealsWithIngredients = meals.map(meal => {
    const mealIngredient = mealsIngredients.filter(ingredient => ingredient.meal_id === meal.id)
    return {
    ...meal,
    ingredients: mealIngredient
    }
    })
    return res.json(mealsWithIngredients)
    } 

  } 

}

module.exports = MealsUsersController;