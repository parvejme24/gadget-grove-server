const express = require("express");
const app = express();
const port = process.env.PORT || 7070;
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Gadget Grove");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gbcelyw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const productsCollection = client.db("productsDB").collection("products");
const brandsCollection = client.db("productsDB").collection("brands");
const cartCollection = client.db("productsDB").collection("cart");

app.get("/brands", async (req, res) => {
  const cursor = brandsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/products/brand/:brand", async (req, res) => {
  const brand = req.params.brand;
  const product = productsCollection.find({ brand });
  const result = await product.toArray();
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productsCollection.findOne(query);
  res.send(result);
});

app.get("/updateProductDetails/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productsCollection.findOne(query);
  res.send(result);
});

app.post("/products", async (req, res) => {
  const product = req.body;
  console.log(product);
  const result = await productsCollection.insertOne(product);
  res.send(result);
});

app.put("/products/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateProduct = req.body;
  const product = {
    $set: {
      product_name: updateProduct.product_name,
      image: updateProduct.image,
      short_description: updateProduct.short_description,
      brand: updateProduct.brand,
      type: updateProduct.type,
      rating: updateProduct.rating,
      price: updateProduct.price,
    },
  };
  const result = await productsCollection.updateOne(filter, product, options);
  res.send(result);
});

app.get("/cart", async (req, res) => {
  const cartProducts = cartCollection.find();
  const result = await cartProducts.toArray();
  res.send(result);
});

app.post("/cart", async (req, res) => {
  const cart = req.body;
  const result = await cartCollection.insertOne(cart);
  res.send(result);
});

app.delete("/cart/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});

app.listen(port, () => {
  console.log(`Gadget Grove is running at http://localhost:${port}`);
});
