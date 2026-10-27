import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB connection ──────────────────────────────────────
const uri = process.env.MONGO_DB;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    // ── Database & Collections ──────────────────────────────
    const db = client.db("zihadsKingdom");
    const productsCollection = db.collection("products");
    const usersCollection = db.collection("users");
    const ordersCollection = db.collection("orders");

    app.post("/api/post/products", async (req, res) => {
  try {
    const data = { ...req.body, createdAt: new Date() };
    const result = await productsCollection.insertOne(data);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

    // ── API routes এখানে লিখবে ──────────────────────────────
    // উদাহরণ (এখন comment করা, দরকার হলে খুলে নাও):
    //
    // app.get("/api/products", async (req, res) => {
    //   try {
    //     const result = await productsCollection.find().toArray();
    //     res.send(result);
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).send({ message: "Internal server error" });
    //   }
    // });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
run();

// ── Test route ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Clothes shop server is running!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
