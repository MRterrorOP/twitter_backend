import { IncomingMessage, ServerResponse } from "http";
import { verifyLoginCredentials } from "../db/crud/verifyLoginCredentials.js";
import checkEmailExistance from "../db/crud/checkEmailExistance.js";
import createJsonWebToken from "../utils/createJsonWebToken.js";

export const login = (req: IncomingMessage, response: ServerResponse) => {
  let reqBody: Buffer[] = [];
  req
    .on("data", (chunk) => {
      reqBody.push(chunk);
    })
    .on("end", async () => {
      const parsedBody: string = Buffer.concat(reqBody).toString();
      // at this point, `reqBody` has the entire request reqBody stored in it as a string

      //we want to check if user input in object or not so we can procced further
      try {
        JSON.parse(parsedBody);
      } catch (error) {
        response.statusCode = 400;
        return response.end(
          JSON.stringify({ message: "Input to meet the require format." })
        );
      }
      const reqBodyAsJson: { email: string; password: string } =
        await JSON.parse(parsedBody);
      if (!reqBodyAsJson.email || !reqBodyAsJson.password) {
        response.statusCode = 400;
        return response.end(
          JSON.stringify({ message: "Email or Password are not fully filled" })
        );
      }

      try {
        const email = reqBodyAsJson.email;
        const password = reqBodyAsJson.password;
        const isAlreadyUser = await checkEmailExistance(email);
        // check user email  already in db or not so proceed further login;

        if (isAlreadyUser) {
          const result = await verifyLoginCredentials({ email, password });
          if (result) {
            const token = createJsonWebToken({
              email: email,
              password: password,
            });
            if (token) {
              response.writeHead(200, {
                "Content-type": "application/json",
                "set-cookie": `authToken=${token}; HttpOnly; Max-Age=3600`,
              });

              return response.end(JSON.stringify({ token }));
            }
            response.writeHead(200, {
              "Content-Type": "application/json",
            });

            return response.end(
              JSON.stringify({ message: "Your are now login" })
            );
          }
          return response.end(JSON.stringify({ message: "Password is wrong" }));
        }
        return response.end(
          JSON.stringify({ message: "Email not exist first create a account" })
        );
      } catch (error) {
        return response.end(JSON.stringify({ message: "password is wrong" }));
      }
    });
};
