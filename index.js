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
         const MyitemCollection = client.db('service').collection('myitem');
         const ManageItemCollection = client.db('service').collection('manageitem')
            
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

        //  post service 
        app.post('/inventory', async(req, res) => {
            const newService = req.body;
            const result = await productCollection.insertOne(newService);
            res.send(result);
        })
                    // delete inventory

    app.delete("/inventory/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
  
        const result = await productCollection.deleteOne(filter);
  
        res.send(result);
      });

    //   update product 
    // app.put("/inventory/:id", async (req, res) => {
    //    const id = req.params.id;
    //    const updatequantity = req.body;
    //    const filter = {_id: ObjectId(id)};
    //    const options = { upsert : true};
    //    const updateddoc = {
    //        $set: {
            
    //         description:updatequantity.description,
    //         gender:updatequantity.gender,
    //         images:updatequantity.images,
    //         name:updatequantity.name,
    //         price:updatequantity.price,
    //         quantity: updatequantity.quantity,
    //         supplierName:updatequantity.supplierName






    //        }
    //    };


    // my manage post product collection from clint  
      app.post('/manageitem' , async(req, res) => {
        const manageitem = req.body;
        const result = await ManageItemCollection.insertOne(manageitem);
        res.send(result);

      })
    //   show product Outsite 
    app.get('/userItem', async(req,res) => {
        const email =req.query.email;
        console.log(email);
        const query = {email:email};
        const cursor =ManageItemCollection.find(query);
        const userItem = await cursor.toArray();
        res.send(userItem);
    });
 
            // delete note

    app.delete("/myitem/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
  
        const result = await MyitemCollection.deleteOne(filter);
  
        res.send(result);
      });

    //   my item service 
    app.get('/myitem', async(req, res) => {
        const query = {};
        const cursor = MyitemCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
    });
    app.post('/myitem', async(req , res) => {
        const quantity = req.body;
        const result = await MyitemCollection.insertOne(quantity);
        res.send(result);
    });
        //  inventory id 
        app.get('/myitem/:id',async(req,res) => {
            const id =req.params.id;
            console.log(id);
            const query={_id: ObjectId(id)};
            const inventory = await MyitemCollection.findOne(query);
            res.send(inventory);
        });

    }
     finally{ }

}
run().catch(console.dir);



app.get('/', (req,res) => {
    res.send('server is runnning and waitting for store')
});
app.get('/add', (req,res) => {
    res.send('ami pari na re pari na ')
});
app.listen(port, () => {
    console.log("server is running on port", port);
});