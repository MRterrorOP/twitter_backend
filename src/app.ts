import url from "node:url";
import { login } from "./routes/login.js";
import { IncomingMessage, ServerResponse } from "node:http";

const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
  const route = req.url;
  console.log("this route is hitted", route);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173/"); // Allow all domains
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Allow these HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // All post route here
  if (req.method === "POST") {
    switch (route) {
      case "/login":
        login(req, res);
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
