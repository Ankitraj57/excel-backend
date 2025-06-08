const FileUpload = require('../models/FileUpload');
const parseExcel = require('../utils/excelParser');

exports.uploadFile = async (req, res) => {
  const parsedData = await parseExcel(req.file.path);
  const record = await FileUpload.create({
    filename: req.file.originalname,
    user: req.user._id,
    parsedData,
  });
  res.status(200).json(record);
};

exports.getUploads = async (req, res) => {
  const uploads = await FileUpload.find({ user: req.user._id });
  res.json(uploads);
};
