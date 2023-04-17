const knex = require('../database/knex')


class IngredientsController {
  async index(req,res) {
    const user_id = req.user.id
    const [lastIngredient] = await knex('ingredients')
      .orderBy('id', 'desc')
      .limit(1)
      .select('id')

    return res.json(lastIngredient.id)
  }
}

module.exports = IngredientsController;