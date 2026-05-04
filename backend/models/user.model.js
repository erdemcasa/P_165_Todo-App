const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+@.+\..+/
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    address: {
      type: String
    },
    zip: {
      type: Number
    },
    location: {
      type: String
    }
  },
  { timestamps: false }
);

UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

