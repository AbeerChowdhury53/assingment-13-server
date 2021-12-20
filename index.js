const express = require('express')
const { MongoClient } = require('mongodb');
var cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpi7f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


async function run() {
  try {
    await client.connect();
    const database = client.db('mobile-cover')
    const coverCollection = database.collection('cover');
    const ratingCollection = database.collection('rating');
    const orderCollection = database.collection('order');
    const userCollection = database.collection('user');


    app.get('/product', async (req, res) => {
      const cursor = coverCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
      // res.json(users);
    })

    app.get('/rating', async (req, res) => {
      const cursor = ratingCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
      // res.json(users);
    })

    app.get('/order', async (req, res) => {
      const cursor = orderCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
      // res.json(users);
    })


    app.get('/product/:id', async function (req, res) {
      const idp = req.params.id;
      console.log(req.body.e)
      const id = req.body.e || idp
      const query = { _id: ObjectId(id) }
      const result = await coverCollection.findOne(query);
      res.json(result)
    })


    app.get('/user/:email', async (req, res)=>{
      const email = req.params.email
      const query = {email: email}
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin'){
        isAdmin = true;
      }
      res.json({isAdmin})
    })


    app.delete('/product/:id', async function (req, res) {
      console.log(req.body.e)
      const id = req.body.e
      const query = { _id: ObjectId(id) }
      const result = await coverCollection.deleteOne(query);
      res.json(result)
    })


    app.post('/order', async function (req, res) {
      const doc = req.body;
      // console.log(doc)
      const result = await orderCollection.insertOne(doc);
      res.json(result)
    })


    app.put('/user/admin', async (req, res) => {
      const user = (req.body)
      console.log(user.email)
      const filter = { email: user.email }
      const updaredoc = { $set: { role: 'admin' } }
      const result = await userCollection.updateOne(filter, updaredoc);
      res.json(result)
    })


    app.post('/user', async (req, res) => {
      const user = req.body
      console.log(user)
      const result = await userCollection.insertOne(user);
      res.json(result)
    })

    app.post('/rating', async function (req, res) {
      const doc = req.body;
      console.log(doc)
      const result = await ratingCollection.insertOne(doc);
      res.json(result)
    })

    app.post('/product', async function (req, res) {
      console.log(req.body)
      const doc = req.body;
      const result = await coverCollection.insertOne(doc);
      res.json(result)
    })


    app.delete('/order/:id', async function (req, res) {
      console.log(req.body.e)
      const id = req.body.e
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query);
      res.json(result)
    })

    //  put api
    app.put('/order/:id', async (req, res) => {
      // const id = req.params.id;
      const { _id, name, Price, descriotion, Image, assress, Mobile, status, email, serviceId } = req.body.e
      const id = _id
      console.log(_id)
      console.log('update user', req.body)
      const updateUser = "Complite";
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: name,
          assress: assress,
          Mobile: Mobile,
          status: updateUser,
          email: email,
          serviceId: serviceId,
          descriotion: descriotion,
          Price: Price,
          image: Image
        },
      }
      const result = await orderCollection.updateOne(filter, updateDoc, options)
      res.json(result);
    })



  }
  finally {
    // await client.close();
  }
}
run().catch(console.dri);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('Example app listening at', port)
})