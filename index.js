const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json())
app.use(cors())

// MongoDB uri
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

        // Get all Toys data and Get Toy by email
         app.get('/toys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result);
        })

         // Get toy by _id
         app.get('/toys/:id', async (req, res) => {
            const { id } = req.params;
            try {
              const toy = await toysCollection.findOne({ _id: new ObjectId(id) });
              if (!toy) {
                return res.status(404).json({ error: 'Toy not found' });
              }
              res.json(toy);
            } catch (error) {
              console.error('Error fetching toy details:', error);
              res.status(500).json({ error: 'Internal server error', message: error.message });
            }
          });

        // Add toy 
        app.post('/toys', async (req, res) => {
            const addedToy = req.body;
            const result = await toysCollection.insertOne(addedToy);
            res.send(result);
        });

        // Delete Toy by Id
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })

        
    // Update Toy by Id
    app.put('/toys/:id', async (req, res) => {
        const id = req.params.id;
        const updatedToy = req.body;
        const query = { _id: new ObjectId(id) };
  
        try {
          const result = await toysCollection.updateOne(query, { $set: updatedToy });
          if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Toy not found' });
          }
          res.json(result);
        } catch (error) {
          console.error('Error updating toy:', error);
          res.status(500).json({ error: 'Internal server error', message: error.message });
        }
      });

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