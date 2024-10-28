import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default function verifyJosnWebToken(token: string) {
  const signatureKey = process.env.SIGNATURE_KEY;
  if (signatureKey) {
    try {
      const result = jwt.verify(token, signatureKey);

      return true;
    } catch (error) {
      console.log("error", false);
      return false;
    }
  }
  return "Signature key not defined";
}
