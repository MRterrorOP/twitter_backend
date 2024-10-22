import clientPromise from "../dbInit.js";

export default async function createUser(email: string, hashPassword: string) {
  const client = await clientPromise;
  const userCollection = client.db("scrt-pwd-data").collection("users");
  const doc = {
    email: email,
    hashPassword: hashPassword,
  };
  try {
    const result = await userCollection.insertOne(doc);
    return result.acknowledged;
  } catch (error) {
    console.log("error during inserting a doc", error);
    return false;
  }
}
