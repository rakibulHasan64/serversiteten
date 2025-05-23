// index.js
const express = require("express");
require("dotenv").config(); 
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;

// Middlewares
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.KEY_USER}:${process.env.KEY_PASS}@cluster0.y3jqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    
    await client.connect();

    const db = client.db("groupshub");
    const collection = db.collection("groups");


    app.post('/groups', async (req, res) => {
      const producted = req.body;
      const result = await collection.insertOne(producted)
      res.send(result);
   });
    
  
   app.get('/groups', async (req, res) => {
    const products = await collection.find().toArray();
    res.send(products);
   });
    
    

   app.get('/groups/email', async (req, res) => {
    const email = req.query.email; 
    const query = { userEmail: email }; 
    const result = await collection.find(query).toArray();
    res.send(result);
  });
  
  

    app.get('/groups/:id', async (req, res) => {
     const id = req.params.id;
     const query = { _id: new ObjectId(id) };
     const result = await collection.findOne(query);
     res.send(result);
    });

    app.delete('/groups/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.send(result);
    });
    

    app.get('/groupsupdated/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collection.findOne(query)
      res.send(result)
    });
    
    //update data single


    app.put('/groupsupdated/:id', async (req, res) => {
      const id = req.params.id;
      const job = req.body;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
    
      const updateDoc = {
        $set: job
      }
      const result = await collection.updateOne(filter, updateDoc, option)
      res.send(result)
    });
    


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   //  await client.close();
  }
}
run().catch(console.dir);




// Basic route
app.get("/", (req, res) => {
  res.send(" Server is running");
});


app.listen(port, () => {
  console.log(` Server listening on port ${port}`);
});

// module.exports = app; 