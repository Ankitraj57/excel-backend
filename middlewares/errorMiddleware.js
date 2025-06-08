const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
  filename: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parsedData: Array
}, { timestamps: true });

module.exports = mongoose.model('FileUpload', fileUploadSchema);
