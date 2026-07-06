const fs = require('fs');
const mongoose = require('mongoose');
const env = fs.readFileSync('.env.local', 'utf8');
let uri = env.split('MONGODB_URI=')[1].split('\n')[0].trim();
if (uri.startsWith('"') && uri.endsWith('"')) {
  uri = uri.slice(1, -1);
}
mongoose.connect(uri).then(async () => {
  const db = mongoose.connection.db;
  const props = await db.collection('properties').find({}).toArray();
  console.log(JSON.stringify(props, null, 2));
  process.exit(0);
}).catch(console.error);
