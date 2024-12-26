const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express App
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect('mongodb://127.0.0.1:27017/productMappings', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// MongoDB Schema and Model
const mappingSchema = new mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
    trim: true,
  },
  standardName: {
    type: String,
    required: true,
    trim: true,
  },
});

const Mapping = mongoose.model('Mapping', mappingSchema);

// API Endpoints

// Fetch all mappings
app.get('/api/mappings', async (req, res) => {
  try {
    const mappings = await Mapping.find();
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching mappings' });
  }
});

// Add a new mapping
app.post('/api/mappings', async (req, res) => {
  try {
    const { supplierName, standardName } = req.body;
    const newMapping = new Mapping({ supplierName, standardName });
    await newMapping.save();
    res.json(newMapping);
  } catch (error) {
    res.status(500).json({ error: 'Error adding mapping' });
  }
});

// Update an existing mapping
app.put('/api/mappings/:id', async (req, res) => {
  try {
    const { supplierName, standardName } = req.body;
    const updatedMapping = await Mapping.findByIdAndUpdate(
      req.params.id,
      { supplierName, standardName },
      { new: true }
    );
    res.json(updatedMapping);
  } catch (error) {
    res.status(500).json({ error: 'Error updating mapping' });
  }
});

// Delete a mapping
app.delete('/api/mappings/:id', async (req, res) => {
  try {
    await Mapping.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mapping deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting mapping' });
  }
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
