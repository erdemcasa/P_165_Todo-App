const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const cleanUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  // eslint-disable-next-line no-unused-vars
  const { password, _id, __v, ...cleanedUser } = obj;
  return cleanedUser;
};

const UserController = {
  createUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const { User } = req.app.locals.models;

      const hashed = await bcrypt.hash(password, 8);
      const result = await User.create({ email: email.toLowerCase(), password: hashed });
      return res.status(201).json({ user: cleanUser(result) });
    } catch (error) {
      console.error('ADD USER: ', error);
      // Duplicate key error code for MongoDB
      if (error && error.code === 11000) {
        return res.status(409).json({ message: 'Un compte avec cet email existe déjà !' });
      }
      return res.status(500).json({ message: "Erreur lors de l'inscription !" });
    }
  },
  getUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const { User } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;
      const result = await User.findOne({ _id: uid }).select('-_id -password -__v');
      if (result) {
        return res.status(200).json({ user: result });
      } else {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('GET USER: ', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },
  editUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const data = req.body;
      const { User } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;
      const user = await User.findOne({ _id: uid });
      if (user) {
        user.name = data.name ? data.name : null;
        user.address = data.address ? data.address : null;
        user.zip = data.zip ? data.zip : null;
        user.location = data.location ? data.location : null;
        const result = await user.save();
        return res.status(200).json({ user: cleanUser(result) });
      } else {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      console.error('UPDATE USER: ', error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
  },
  deleteCurrentUser: async (req, res) => {
    try {
      const user_id = req.sub;
      const { User } = req.app.locals.models;

      const uid = mongoose.Types.ObjectId.isValid(user_id) ? mongoose.Types.ObjectId(user_id) : user_id;
      await User.deleteOne({ _id: uid });
      return res.status(200).json({ id: user_id });
    } catch (error) {
      console.error('DELETE USER: ', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l utilisateur' });
    }
  }
};

module.exports = UserController;
