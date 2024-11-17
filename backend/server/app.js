// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();

// // Middleware
// app.use(express.json());

// // Environment Variables
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// // MongoDB Connection
// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRoutes from './routes/api.js'; 

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});