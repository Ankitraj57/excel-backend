const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parsedData: Array
}, { timestamps: true });

module.exports = mongoose.model('file', fileSchema);
