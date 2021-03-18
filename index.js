const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;

app.get('/', (req, res) => {
    // res.send('Hello World')
    res.sendFile(__dirname + '/index.html')
})

// const name = crudUser
// const pass = znXi7XgQEYLH63jq
// dbname = userInformation

const uri = "mongodb+srv://crudUser:znXi7XgQEYLH63jq@cluster0.bjf0d.mongodb.net/userInformation?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const userCollection = client.db("userInformation").collection("users");
  // perform actions on the collection object
//   client.close();
  app.post('/addUser', (req, res) => {
    const user = req.body;
    userCollection.insertOne(user)
    .then( result => {
        // console.log('Data Added');
        res.redirect('/')
    })
  })

  app.get('/users', (req, res) => {
      userCollection.find({})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.get('/user/:id', (req, res) => {
      userCollection.find({_id : ObjectId(req.params.id)})
      .toArray( (err, documents) => {
          res.send(documents[0])
      })
  })

  app.patch('/update/:id', (req, res) => {
      userCollection.updateOne({_id : ObjectId(req.params.id)} , 
      {
          $set : {name : req.body.name, email : req.body.email, phone : req.body.phone}
      })
      .then( result => {
          console.log(result);
          res.send(result.matchedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
      userCollection.deleteOne({_id : ObjectId(req.params.id)})
      .then(result => {
          res.send(result.deletedCount > 0)
      })
  })

});


app.listen(port);