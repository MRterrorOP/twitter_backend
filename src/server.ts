import { createServer, IncomingMessage, ServerResponse } from "node:http";
import * as dotenv from "dotenv";
import requestHandler from "./app.js";
import dbStatus from "./db/dbStatus.js";

dotenv.config({ path: ".env" });

const hostname: string = process.env.APP_HOSTNAME as string;
const port: string = process.env.PORT as string;

//This tell us if server is connected with database or not
const result = await dbStatus();
console.log(result);

//Server req handler
createServer((req, res) => requestHandler(req, res)).listen(
  Number(port),
  hostname,
  () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  }
);
