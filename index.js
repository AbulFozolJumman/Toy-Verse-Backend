const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json())
app.use(cors())

// MongoDB

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0ztfqf2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const toysCollection = client.db('Toy-Verse').collection('toys');

    app.get('/toys', async(req, res) => {
        const result = await toysCollection.find().toArray();
        res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Default 
app.get('/', (req, res) => {
    res.send('Toy Verse Server is Running')
})

app.listen(port, () => {
    console.log(`Toy Verse server is running on port: ${port}`);
})