const express = require('express');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const port = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Define API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/uploads', require('./routes/fileRoutes'));
app.use('/api/mail', require('./routes/mailRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/labs', require('./routes/labRoutes'));

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

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
