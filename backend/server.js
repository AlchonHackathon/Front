const express = require('express');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 5100;
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db')

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'client_id', 'client_secret']
};

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/verification', require('./routes/verificationRoutes'));

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.get('*', (req, res) => {
  console.log('Serving index.html for unmatched route');
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
