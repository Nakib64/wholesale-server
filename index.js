require("dotenv").config();
const express = require("express");
const fs = require("fs")
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require("mongodb");

const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.rcnlifl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const products = JSON.parse(fs.readFileSync("products.json", "utf-8"));


async function run() {
	try {
		await client.connect();

       

		const productsCollection = client
			.db("WholeSale")
			.collection("productsCollection");

             const result =await productsCollection.insertMany(products)
        app.post('/allProducts', async(req, res)=>{
            const product = req.body;
            const result = await productsCollection.insertOne(product)
            res.send(result)
        })
		app.get("/", (req, res) => {
			res.send("hlw world");
		});
		app.listen(port, () => {
			console.log(`server running on the port ${port}`);
		});
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
	}
}
run().catch(console.dir);
