import clientPromise from "../dbInit.js";
import checkEmailExistance from "./checkEmailExistance.js";
import bycrpt from "bcrypt";

export const verifyLoginCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const result = await checkEmailExistance(email);
    if (result) {
      const client = await clientPromise;
      const userCollection = client.db("scrt-pwd-data").collection("users");
      const userHashPassword = await userCollection
        .find({ email: email }, { projection: { hashPassword: 1, _id: 0 } })
        .toArray();
      try {
        const result = await bycrpt.compare(
          password,
          userHashPassword[0].hashPassword
        );
        return result;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
