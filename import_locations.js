require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const xlsx = require('xlsx');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env.local');
  process.exit(1);
}

const locationSchema = new mongoose.Schema({
  postCode: String,
  tambonId: String,
  tambonThai: String,
  districtThai: String,
  provinceThai: String,
});

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const workbook = xlsx.readFile('C:\\Users\\art20\\Desktop\\Web\\เขต\\เขต-อำเภอ.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const locations = data.map(row => ({
      postCode: String(row.PostCode),
      tambonId: String(row.TambonID),
      tambonThai: row.TambonThaiShort,
      districtThai: row.DistrictThaiShort,
      provinceThai: row.ProvinceThai,
    }));

    // Clear existing to avoid duplicates if run multiple times
    await Location.deleteMany({});
    
    await Location.insertMany(locations);
    console.log(`Successfully imported ${locations.length} locations!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
