import clientPromise from "./dbInit.js";

export default async function dbStatus() {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.command({ ping: 1 });
    return { db_connected: true };
  } catch (error) {
    console.log(error);
    return { db_connected: false };
  }
}
