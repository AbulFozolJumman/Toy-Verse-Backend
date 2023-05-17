const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json())
app.use(cors())

// Default 
app.get('/', (req, res) => {
    res.send('Toy Verse Server is Running')
})

app.listen(port, () => {
    console.log(`Toy Verse server is running on port: ${port}`);
})