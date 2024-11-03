import { IncomingMessage, ServerResponse } from "http";
import { verifyLoginCredentials } from "../db/crud/verifyLoginCredentials.js";
import checkEmailExistance from "../db/crud/checkEmailExistance.js";
import createJsonWebToken from "../utils/createJsonWebToken.js";

export const test = (req: IncomingMessage, response: ServerResponse) => {
  let reqBody: Buffer[] = [];
  req
    .on("data", (chunk) => {
      reqBody.push(chunk);
    })
    .on("end", async () => {
      const token = req.headers.authorization;
      console.log(token);
      if (!token || token.length == 0) {
        response.statusCode = 400;
        return response.end("not allowed");
      }

      response.statusCode = 200;
      return response.end("ok");
    });
};
