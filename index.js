const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config()


// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mspjb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{ 
        await client.connect();
         const productCollection = client.db('service').collection('product');
         const quantityCollection = client.db('service').collection('quantity');
            
        //  all servise
         app.get('/inventory', async(req, res) => {
             const query = {};
             const cursor = productCollection.find(query);
             const products = await cursor.toArray();
             res.send(products);
         });
        //  inventory id 
         app.get('/inventory/:id',async(req,res) => {
             const id =req.params.id;
             console.log(id);
             const query={_id: ObjectId(id)};
             const inventory = await productCollection.findOne(query);
             res.send(inventory);
         });
        //  quantityCollection  
        app.post('/quantity', async(req , res) => {
            const quantity = req.body;
            const result = await quantityCollection.insertOne(quantity);
            res.send(result);
        })
    }
     finally{ }

}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send('server is runnning and waitting for store')
});
app.listen(port, () => {
    console.log("server is running on port", port);
});