const xlsx = require('xlsx');
const fs = require('fs');

const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);
  fs.unlinkSync(filePath);
  return data;
};

module.exports = parseExcel;
