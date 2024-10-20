import clientPromise from "../dbInit.js";
export default async function checkEmailExistance(email: string) {
  try {
    const client = await clientPromise;
    const db = client.db("scrt-pwd-data");
    const userCollection = db.collection("users");
    const findEmailResult = await userCollection.findOne({ email: email });
    if (findEmailResult) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return;
  }
}
