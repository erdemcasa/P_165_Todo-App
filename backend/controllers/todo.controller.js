const mongoose = require('mongoose');

const TodoController = {
  createTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { text, date } = req.body;
      const { Todo } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;

      const todo = await Todo.create({
        text,
        date,
        completed: false,
        user_id: uid
      });

      return res.status(201).json(todo);
    } catch (error) {
      console.error('ADD TODO: ', error);
      return res.status(500).json({ message: 'Erreur lors de la création du todo' });
    }
  },
  getAllTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const { Todo } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;

      const todos = await Todo.find({ user_id: uid }).sort({ date: 1 }).select('-user_id');
      return res.status(200).json(todos);
    } catch (error) {
      console.error('GET ALL TODO: ', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des todos' });
    }
  },
  editTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todoId = req.params.id;
      const data = req.body;
      const { Todo } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;
      const id = mongoose.Types.ObjectId.isValid(todoId) ? mongoose.Types.ObjectId(todoId) : todoId;

      const result = await Todo.findOne({ _id: id, user_id: uid });
      if (result) {
        result.completed = typeof data.completed !== 'undefined' ? data.completed : result.completed;
        result.text = data.text ? data.text : result.text;
        result.date = data.date ? data.date : result.date;
        await result.save();
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ message: 'Todo non trouvé' });
      }
    } catch (error) {
      console.error('UPDATE TODO: ', error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour du todo" });
    }
  },
  deleteTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const todo_id = req.params.id;
      const { Todo } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;
      const id = mongoose.Types.ObjectId.isValid(todo_id) ? mongoose.Types.ObjectId(todo_id) : todo_id;

      await Todo.deleteOne({ _id: id, user_id: uid });
      return res.status(200).json({ id: todo_id });
    } catch (error) {
      console.error('DELETE TODO: ', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression du todo' });
    }
  },
  getSearchTodo: async (req, res) => {
    try {
      const user_id = req.sub;
      const q = req.query.q || '';
      const { Todo } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;

      // Use MongoDB text index search
      const todos = await Todo.find({ user_id: uid, $text: { $search: q } }).sort({ date: 1 }).select('-user_id');
      return res.status(200).json(todos);
    } catch (error) {
      console.error('SEARCH TODO: ', error);
      return res.status(500).json({ message: 'Erreur lors de la recherche' });
    }
  }
};

module.exports = TodoController;
