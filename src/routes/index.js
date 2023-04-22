const {Router} = require('express')

const usersRouter = require('./users.routes')
const mealsRouter = require('./meals.routes')
const sessionsRouter = require('./sessions.routes')

const routes = Router()

routes.get('/', (req, res) => {
  res.send('API RUNNING!');
});
routes.use('/users', usersRouter)
routes.use('/files', usersRouter)
routes.use('/meals', mealsRouter)
routes.use('/sessions', sessionsRouter)

module.exports = routes