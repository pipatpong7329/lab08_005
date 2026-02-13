//const express = require('express');
//const cors = require('cors');
import express from "express";
import cors from "cors";


//const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(cors());
app.use(express.json());


import bookRoutes from './routes/bookRoutes.js'
app.use('/api/books', bookRoutes);

import authRoutes from "./routes/authRoutes.js"
app.use('/api/auth',authRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Book API' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});