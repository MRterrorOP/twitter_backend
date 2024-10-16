import { createServer, IncomingMessage, ServerResponse } from "node:http";
import * as dotenv from "dotenv";
import requestHandler from "./app.js";

dotenv.config({ path: "../.env" });
const hostname: string = process.env.HOSTNAME as string;
const port: string = process.env.PORT as string;

createServer((req, res) => requestHandler(req, res)).listen(
  Number(port),
  hostname,
  () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  }
);

// (req, res) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   res.end("Hello World");}
