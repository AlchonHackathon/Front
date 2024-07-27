const express = require('express');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');
const port = 5050;

const app = express();

// Placeholder for authentication middleware
const authMiddleware = (req, res, next) => {
  // Authentication logic here
  console.log('Authentication middleware executed');
  next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this to your frontend's URL
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));

// Define API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/verification', authMiddleware, require('./routes/verificationRoutes'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Log each request to the server
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Catch-all handler to serve index.html for any request that doesn't match above
app.get('*', (req, res) => {
  console.log('Serving index.html for unmatched route');
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server started on port ${port}`));
