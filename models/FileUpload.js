const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parsedData: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
