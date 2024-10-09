const express = require('express')
const cors = require('cors')
require('dotenv').config()
var jwt = require('jsonwebtoken');
const app = express()
const port =process.env.PORT|| 6000

app.use(express.json())
app.use(cors())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugmduxl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    const database = client.db("Bangla-kitchen");
    const menu = database.collection("menuCollection");
    const user = database.collection("userCollection");
    const order = database.collection("orderCollection");
  


    app.post('/jwt',(req,res)=>{
      const user = req.body;
       const token= jwt.sign(user,process.env.SecretToken,{
          expiresIn:'10d'
        })
        // console.log(token)
        
        res.send(token)
    })


    app.post('/allmenu',async(req,res)=>{
      const allDataPost= req.body;
      const result=await menu.insertOne(allDataPost);
      res.send(result)
    })
    app.delete('/allmenu/:id',async(req,res)=>{
      const id= req.params.id;
      const result=await menu.deleteOne({_id:new ObjectId(id)});
      res.send(result)
    })
    app.get('/allmenu',async(req,res)=>{
      const result=await menu.find().toArray();
      res.send(result)
    })
    
  
    app.post('/user',async(req,res)=>{
         const userData=req.body;
         const exitUser=await user.findOne({email:userData.email})
         if(exitUser){
          return res.status(400).send({message:'user exist'})
         }

         const result=await user.insertOne(userData);
         res.status(200).send(result)
    })
    app.get('/user',async(req,res)=>{
         const result= await user.find().toArray()
         res.send(result)
    })
    app.delete('/user/:id',async(req,res)=>{
      const id=req.params.id
         const result= await user.deleteOne({_id: new ObjectId(id)})
         res.send(result)
    })
    app.patch('/user/:id',async(req,res)=>{
      const id=req.params.id
      const result = await user.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: { role: 'admin' } } // Deactivate user
    );
         res.send(result)
    })

    app.get('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const usercheck = await user.findOne(query)
      const result = { admin: usercheck?.role === 'admin' }
      res.send(result)
    })

    // order

    app.post('/order',async(req,res)=>{
      const orderdata=req.body;
      await order.insertOne(orderdata);
      res.status(200).send({message:'submit order'})
    })
    app.get('/order',async(req,res)=>{

     const result= await order.find().toArray();
      res.status(200).send(result)
    })
    app.delete('/order/:id',async(req,res)=>{
      const id=req.params.id
     const result= await order.deleteOne({_id: new ObjectId(id)});
      res.status(200).send(result)
    })
    app.patch('/order/:id',async(req,res)=>{
      const id=req.params.id
      const result = await order.updateOne(
        { _id: new ObjectId(id) }, 
        { $set: { status: 'success' } } // Deactivate user
    );
         res.send(result)
    })
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Bangla kitchen listening on port ${port}`)
})