// Initialize and return Mongoose models
const UserModel = require('./user.model');
const TodoModel = require('./todo.model');

function initModels() {
  const User = UserModel;
  const Todo = TodoModel;

  return { User, Todo };
}

module.exports = { initModels };
