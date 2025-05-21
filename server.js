// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const { createClient } = require('@supabase/supabase-js');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Replace with your Supabase project details
// const supabaseUrl = 'https://svqnqhafkkxltcycbrrv.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cW5xaGFma2t4bHRjeWNicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzc0NDcwOCwiZXhwIjoyMDYzMzIwNzA4fQ.hTGKUX9uQrp8A40EHHVyqGoivrraafvRzUPws0G_jlI';
// const supabase = createClient(supabaseUrl, supabaseKey);

// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// app.post('/contact', async (req, res) => {
//   const { name, email, message } = req.body;

//   const { data, error } = await supabase
//     .from('messages')
//     .insert([{ name, email, message }]);

//   if (error) {
//     console.error('Error saving to Supabase:', error);
//     return res.status(500).send('Error saving message.');
//   }

//   console.log('Saved message to Supabase:', data);
//   res.send('Message saved! Thank you.');
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const uri = 'mongodb+srv://sellobothata:GjiAZQG3Ekwztltd@cluster0.b93dbea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

connectToMongo();
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Form submission route
app.post('/contact',async(req, res) =>{
  const { name, email, message } = req.body;

  try {
    const db = client.db('fancyDB'); // create/use 'fancyDB'
    const collection = db.collection('messages');

    await collection.insertOne({ name, email, message, date: new Date() });

    res.status(200).send('Form submitted successfully');
  } catch (err) {
    console.error('Error saving to MongoDB:', err);
    res.status(500).send('Error saving to MongoDB');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
