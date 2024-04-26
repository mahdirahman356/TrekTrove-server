const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json()) 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rz0kihv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = "mongodb+srv://trektrovProject11:z4X8dQWfXH7XPQjr@cluster0.rz0kihv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("touristsSpotDB");
    const touristsSpotCollection = database.collection("touristsSpot");
    
    app.get("/touristsSpot", async(req, res) => {
        const cursor = touristsSpotCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get("/touristsSpot/:id", async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)};
      const result = await touristsSpotCollection.findOne(query);
      res.send(result)  
    })

    app.put("/touristsSpot/:id", async(req, res) => {
      const id = req.params.id
      const tourists = req.body
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          touristSpot : tourists.touristSpot,  
          photoURL : tourists.photoURL, 
          cost : tourists.cost, 
          seasonality : tourists.seasonality, 
          travelTime : tourists.travelTime, 
          perYear : tourists.perYear, 
          countryName : tourists.countryName, 
          location : tourists.location, 
          email : tourists.email,
          description : tourists.description,  
          name : tourists.name
        },
      };
      const result = await touristsSpotCollection.updateOne(filter, updateDoc, options);
      res.send(result)

    })

    app.post("/touristsSpot", async(req, res) =>{
        const tourists = req.body
        const result = await touristsSpotCollection.insertOne(tourists);
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    app.get("/", (req, res) => {
        res.send("TrokTrove Sarver Side")
    })
    
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
