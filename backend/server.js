const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const feedRoutes = require('./routes/feedRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/feeds', feedRoutes);
app.use('/admin', adminRoutes);

// Start the server first
const PORT = process.env.PORT || 8080; // Changed default from 5000 to 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Then connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB error:', err));