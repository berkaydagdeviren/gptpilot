const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import userRoutes
const saleRoutes = require('./routes/saleRoutes'); // Import saleRoutes
const companyRoutes = require('./routes/companyRoutes'); // Import companyRoutes
const productRoutes = require('./routes/productRoutes'); // Import productRoutes
const importRoutes = require('./routes/importRoutes'); // Import importRoutes for CSV import functionality
const importProductRoutes = require('./routes/importProductRoutes'); // Import importProductRoutes for product CSV import functionality
const cors = require('cors'); // Import cors module

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Trust the proxy to ensure secure headers are being transmitted properly
app.set('trust proxy', true);

// Enable CORS for all routes with specific configuration
app.use(cors({
  origin: ['http://localhost:3000'], // Specify the origin of requests that are allowed
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], // Specify the methods allowed
  credentials: true, // Allow credentials
  allowedHeaders: ['Content-Type', 'Authorization'] // Explicitly specify allowed headers
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route for testing the server
app.get('/', (req, res) => {
  res.json({ message: 'Daily Retail Records API' });
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use user routes
app.use('/api/user', userRoutes);

// Use sale routes for handling "/api/sales" route
app.use('/api/sales', saleRoutes);

// Use company routes for handling "/api/companies" route
app.use('/api/companies', companyRoutes);

// Use product routes for handling "/api/products" route
app.use('/api/products', productRoutes);

// Use import routes for handling CSV imports
app.use('/api/import', importRoutes);

// Use importProductRoutes for handling product CSV imports
app.use(importProductRoutes);

// Server listens on the port defined in the .env file, or 3002 as a fallback
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
  console.error('Error starting server:', error);
});