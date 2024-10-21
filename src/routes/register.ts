import { IncomingMessage, ServerResponse } from "http";
import checkEmailExistance from "../db/crud/checkEmailExistance.js";

export const register = (req: IncomingMessage, res: ServerResponse) => {
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

    if (isEmailValid && isPassValid && isCnfPassValid) {
      //TODO: check email if it is already existed in database or not
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
      res.statusCode = 200;
      res.setHeader("Content-type", "application/json");
      return res.end(JSON.stringify({ message: "User Created successfully" }));
    }
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        message: "Email or password not fullfilled the required condition.",
      })
    );
  });
};
