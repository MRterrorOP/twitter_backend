import { IncomingMessage, ServerResponse } from "http";
import checkEmailExistance from "../db/crud/checkEmailExistance.js";
import bcrypt from "bcrypt";
import createUser from "../db/crud/createUser.js";

const saltRounds = 10;

export const register = async (req: IncomingMessage, res: ServerResponse) => {
  const reqBody: Buffer[] = [];
  req.on("data", (chunk) => {
    reqBody.push(chunk);
  });
  req.on("end", async () => {
    const reqBodyAsStr = Buffer.concat(reqBody).toString();
    try {
      //catch error if req body is not type of json
      JSON.parse(reqBodyAsStr);
    } catch {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          message: "Form Data does not meet the required format.",
        })
      );
    }
    // If we received from data successfully Then we can check its valdity
    let reqBodyAsJson: {
      email: string;
      password: string;
      cnfPassword: string;
    } = JSON.parse(reqBodyAsStr);

    const isEmailValid =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        reqBodyAsJson.email
      );
    const isPassValid =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%])(?=.*[@#$%]).{8,}$/.test(
        reqBodyAsJson.password
      );
    const isCnfPassValid = reqBodyAsJson.password === reqBodyAsJson.cnfPassword;
    //check if all thing input filled is correct
    if (isEmailValid && isPassValid && isCnfPassValid) {
      const isEmailAlreadyExist = await checkEmailExistance(
        reqBodyAsJson.email
      );
      if (isEmailAlreadyExist) {
        res.statusCode = 409;
        res.setHeader("Content-type", "application/json");
        return res.end(
          JSON.stringify({
            message:
              "User already existed with this email.  Please use a new different email or Login with existed email",
          })
        );
      }
      const email = reqBodyAsJson.email;
      const password = reqBodyAsJson.password;
      try {
        const hashPassword = await bcrypt.hash(password, saltRounds);
        const isUserCreadted = await createUser(email, hashPassword);
        if (isUserCreadted) {
          res.statusCode = 200;
          res.setHeader("Content-type", "application/json");
          return res.end(
            JSON.stringify({ message: "User Created successfully" })
          );
        }
        res.statusCode = 501;
        res.setHeader("Content-type", "application/json");
        return res.end(
          JSON.stringify({
            message: "Internal server Error. Try after some time",
          })
        );
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-type", "application/json");
        return res.end(JSON.stringify({ message: "Internal server error" }));
      }

      // Store hash in your password DB.
    }
    //If email or password not meet required condition then we return;
    res.statusCode = 400;
    return res.end(
      JSON.stringify({
        message: "Email or password not fullfilled the required condition.",
      })
    );
  });
};
