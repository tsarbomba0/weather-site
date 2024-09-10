// Express
const exp = require('express');
const api = exp();
const port = 5555;

// MongoDB
const uri = `mongodb+srv://xx:xx@cluster0.9ph1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const { MongoClient } = require("mongodb");
const client = new MongoClient(uri);


// CORS
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

// Connect to database
async function read_from_db(query, res) {
  try {
    await client.connect();
    const database = client.db('weather_users');
    const collection = database.collection('weatherUsers');
    var result = await collection.findOne(query)
    .then(response => res.send(response))
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function write_to_db(object1, object2) {
    try {
      await client.connect();
      const database = client.db('weather_users');
      const collection = database.collection('weatherUsers');
      await collection.updateOne(object1, object2, {upsert: true});
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }




api.use(cors(corsOptions)) // fixes cors errors

api.get('/read/:userid', (req, res) => {
    var query = { userid: `${req.params.userid}` }; 
    read_from_db(query, res);
})

api.get('/write/:userid&:city', (req, res) => {
    res.send(`${req.params.userid}`);
    //var object = { userid: `${req.params.userid}`, city: `${req.params.city}` }; 
    write_to_db({ "userid": req.params.userid}, {$set: {city: req.params.city} });
})

api.listen(port, () => {
    console.log(`Listening on ${port}`)
})