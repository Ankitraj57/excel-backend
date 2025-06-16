const xlsx = require('xlsx');
const fs = require('fs');

const parseExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    fs.unlinkSync(filePath); // delete file after parsing
    return data;
  } catch (error) {
    // Optional: delete file if error occurs to avoid leftover files
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

module.exports = parseExcel;
