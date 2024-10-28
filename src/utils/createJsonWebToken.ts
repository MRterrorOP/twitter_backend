import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

interface userDetails {
  email: string;
  password: string;
}

export default function createJsonWebToken(userDetails: userDetails) {
  const signatureKey = process.env.SIGNATURE_KEY;
  if (signatureKey) {
    try {
      const token = jwt.sign(userDetails, signatureKey, { expiresIn: 60 * 3 });
      return token;
    } catch (error) {
      return false;
    }
  }
  return false;
}
