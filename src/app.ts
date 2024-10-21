import { login } from "./routes/login.js";
import { register } from "./routes/register.js";
import { IncomingMessage, ServerResponse } from "node:http";

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const route = req.url;
  console.log("Route received:", route);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log(req.method);
  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ message: "Your are able to send post request" }));
  }
  // All post route here
  if (req.method === "POST") {
    switch (route) {
      case "/login":
        login(req, res);
        break;
      case "/register":
        register(req, res);
        break;
      default:
        res.statusCode = 404;
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ message: "page not found" }));
        break;
    }
  }

  //   console.log("req rawheader", req.rawHeaders);
  //   console.log("req url", req.url);
};

export default requestHandler;
