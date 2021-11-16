require('dotenv').config()
const express = require('express');
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xgoot.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri);






async function run() {
    try {
        await client.connect();
        const database = client.db("GhuriGhor");
        const UserTable = database.collection("Users");
        const ProductTable = database.collection('ProductTable');
        const orderTable = database.collection('Orders');
        const ReviewTable = database.collection('Review');
        const EventTable = database.collection('Events');
        //add product
        app.post('/addProduct', async (req, res) => {
            const doc = req.body;
            const result = await ProductTable.insertOne(doc);
            console.log(result);
            res.send(result);
        })


        //get producst
        app.get('/products', async (req, res) => {
            console.log("Hitting");
            const result = ProductTable.find({});
            const response = await result.toArray();
            console.log(response);
            res.send(response);
        })


        //get product with id
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const cursor = ProductTable.find({ _id: ObjectId(id) });
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        //send orders from database
        app.get('/orders', async (req, res) => {
            const cursor = orderTable.find({});
            const result = await cursor.toArray();
            res.send(result);
        })


        //send reviews from database

        app.get('/reviews',async (req, res) => {
            const cursor = ReviewTable.find({});
            const result = await cursor.toArray();
            res.send(result);
        })


        //send events
        app.get('/events',async (req, res) => {
            const cursor = EventTable.find({});
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        //send orders by user mail
        app.get('/myOrder/:mail', async (req, res) => {
            const id = req.params.mail;
            console.log(id);
            const cursor = orderTable.find({ email: req.params.mail });
            const result = await cursor.toArray();
            res.send(result);
        })




        //adding orders
        app.post('/order', async (req, res) => {
            const doc = req.body;
            const result = await orderTable.insertOne(doc);
            console.log(result);
            res.send(result);
        })


        //adding review
        app.post('/addReview',async (req, res) => {
            const doc = req.body;
            const result = await ReviewTable.insertOne(doc);
            console.log(result);
            res.send(result);
        })

        //update status
        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: updateStatus.email,
                    transactionId: updateStatus.transactionId,
                    pid: updateStatus.pid,
                    status: updateStatus.status,
                },
            };
            const result = await orderTable.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })


        //get all user
        app.get('/users', async (req, res) => {
            const cursor = UserTable.find({});
            const result = await cursor.toArray();
            res.send(result);
        })


        //update user role status
        app.put('/updateUser/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    email: updateStatus.email,
                    name: updateStatus.name,
                    role: updateStatus.role,
                },
            };
            const result = await UserTable.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        })

        //cancel order
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id:ObjectId (id) };
            console.log(query);
            const result = await orderTable.deleteOne(query);
            console.log(result);
            res.send(result);
        })


        //add User
        app.post('/addUser',async(req,res)=>{
            const doc = req.body;
            const result = await UserTable.insertOne(doc);
            console.log(result);
            res.send(result);
        })


        //add Orders
        app.post('/addOrders',async(req,res)=>{
            const doc = req.body;
            const result = await orderTable.insertOne(doc);
            console.log(result);
            res.send(result);
        })

        // find user by id

        app.get('/user/:email',async(req,res)=>{
            const email = req.params.email;
            console.log(email);
            const cursor = UserTable.find({ email: email});
            const result = await cursor.toArray();
            res.send(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log('server is running on port 5000');
})
