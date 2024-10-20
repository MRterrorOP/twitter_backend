import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const uri = process.env.DB_URI;
console.log("this is env uri", uri);

if (!uri) {
  throw new Error("Please add your Mongo URI to Environment Variables.");
}

let client = new MongoClient(uri);
let clientPromise = client.connect();
export default clientPromise;
