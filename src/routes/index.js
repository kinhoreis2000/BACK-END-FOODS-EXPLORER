const {Router} = require('express')

const usersRouter = require('./users.routes')
const mealsRouter = require('./meals.routes')
const mealsUsersRoutes = require('./meals.users.routes')
const ingredientsRouter = require('./ingredients.routes')
const sessionsRouter = require('./sessions.routes')

const routes = Router()

routes.get('/', (req, res) => {
  res.send('API RUNNING!');
});
routes.use('/users', usersRouter)
routes.use('/files', usersRouter)
routes.use('/meals', mealsRouter)
routes.use('/mealsUser', mealsUsersRoutes)
routes.use('/ingredients', ingredientsRouter)
routes.use('/sessions', sessionsRouter)

module.exports = routes