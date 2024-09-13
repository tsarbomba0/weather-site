// Express
const exp = require('express');
const api = exp();
const port = 5555;

// MongoDB
const uri = `mongodb+srv://xx:xx@cluster0.9ph1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri);


// fixes cors errors
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


// Function to read from database
async function read_from_db(query, res) {
  try {
    await client.connect();
    const database = client.db('weather_users');
    const collection = database.collection('weatherUsers');
    var result = await collection.findOne(query)
    .then(response => {
      if (response == null){
        res.status(204).send(response)
        console.log("Null response!")
      } else {
        res.status(200).send(response)
      }
        
    });
  } finally {
    //await client.close();
  }
}

// Function to write to the database
async function write_to_db(object1, object2) {
    try {
      await client.connect();
      const database = client.db('weather_users');
      const collection = database.collection('weatherUsers');
      await collection.updateOne(object1, object2, {upsert: true});
    } finally {
      await client.close();
    }
  }

api.use(cors(corsOptions))

// API response for a GET request with /read/<userid>
api.get('/read/:userid', (req, res) => {
    // Read action from db
    var query = { userid: `${req.params.userid}` }; 
    read_from_db(query, res);
})

// API response for a GET request with /write/<userid>&<city>
api.get('/write/:userid&:city', (req, res) => {
    // Writing to db
    res.send(`${req.params.userid}`); 
    write_to_db({ "userid": req.params.userid}, {$set: {city: req.params.city} });
})


// API listening on port 5555
api.listen(port, () => {
    console.log(`Listening on ${port}`)
})