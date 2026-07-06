const xlsx = require('xlsx');

const workbook = xlsx.readFile('C:\\Users\\art20\\Desktop\\Web\\เขต\\เขต-อำเภอ.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);
console.log(data.slice(0, 5));
console.log('Total rows:', data.length);
