const { DataTypes } = require('sequelize');

const UserModel = require('./user.model');
const TodoModel = require('./todo.model');

function initModels(sequelize) {
  const User = UserModel(sequelize, DataTypes);
  const Todo = TodoModel(sequelize, DataTypes);

  return { User, Todo };
}

module.exports = { initModels };
