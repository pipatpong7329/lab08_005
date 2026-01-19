const express = require('express');
const cors = require('cors');

require('dotenv').config();

const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,() =>{
    console.log(`Server is running on http://localhost: ${PORT}`);
});
