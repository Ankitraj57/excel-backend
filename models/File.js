const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalname: { // Name of the file as uploaded by the user
    type: String,
    required: true,
  },
  filename: { // Unique filename stored on the server
    type: String,
    required: true,
  },
  mimetype: String, // optional
  size: Number, // optional
  parsedData: Array, // top rows or summary
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
