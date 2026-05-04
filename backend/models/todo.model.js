const mongoose = require('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: false
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    },
    
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: false }
);

// Text index for full-text search on `text`
TodoSchema.index({ text: 'text' });

module.exports = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

