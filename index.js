const express = require('express');
const app = express();
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldjypij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    const jobsCollection = client.db('soloSphere').collection('Alljobs')
    const bidsCollection = client.db('soloSphere').collection('bids')

    // Get all jobs data from db
    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray()

      res.send(result)
    })

    // Get a single job data from db using job id
    app.get('/job/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query)
      res.send(result)
    })

    // Save a bid data in db
    app.post('/bid', async (req, res) => {
      const bidData = req.body

      const result = await bidsCollection.insertOne(bidData)
      res.send(result)
    })
    // Save a job data in db
    app.post('/job', async (req, res) => {
      const jobData = req.body

      const result = await jobsCollection.insertOne(jobData)
      res.send(result)
    })

    // get all jobs posted by a specific user
    app.get('/jobs/:email', async (req, res) => {
      const email = req.params.email
      const query = { 'buyer.email': email }
      const result = await jobsCollection.find(query).toArray()
      res.send(result)
    })
    // delete a job data from db
    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.deleteOne(query)
      res.send(result)
    })

    // update a job in db
    app.put('/job/:id', async (req, res) => {
      const id = req.params.id
      const jobData = req.body
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          ...jobData,
        },
      }
      const result = await jobsCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )










   
 } 
 
  


  finally {
    // No need to close the connection because it will stay open as long as the app is running

  }
}

run().catch(console.dir);

// Basic route to check server status
app.get('/', (req, res) => {
  res.send('Selling is Starting');
});

// Start the server
app.listen(port, () => {
  console.log(`Selling is sitting on port ${port}`);
});
