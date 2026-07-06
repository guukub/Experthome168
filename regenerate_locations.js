const fs = require('fs');
const xlsx = require('xlsx');

const workbook = xlsx.readFile('C:\\Users\\art20\\Desktop\\Web\\เขต\\เขต-อำเภอ.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

const formattedData = data.map(row => ({
  tambon: row.TambonThaiShort,
  district: row.DistrictThaiShort,
  province: row.ProvinceThai,
  postCode: String(row.PostCode || '')
}));

fs.writeFileSync('C:\\Users\\art20\\Desktop\\Web\\src\\lib\\locations.json', JSON.stringify(formattedData));
console.log('Done!');
