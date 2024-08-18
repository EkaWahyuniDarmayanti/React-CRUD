const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/crud', { 
    // useNewUrlParser: true, 
    // useUnifiedTopology: true 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const itemSchema = new mongoose.Schema({
  nama: String, 
  deskripsi: String
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

app.put('/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
