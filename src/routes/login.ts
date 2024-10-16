import { IncomingMessage, ServerResponse } from "http";

export const login = (req: IncomingMessage, response: ServerResponse) => {
  let body: Buffer[] = [];
  req
    .on("data", (chunk) => {
      body.push(chunk);
    })
    .on("end", () => {
      const parsedBody: string = Buffer.concat(body).toString();
      // at this point, `body` has the entire request body stored in it as a string

      console.log(parsedBody);
    });
  response.writeHead(200, {
    "Content-Type": "application/json",
    location: "http://localhost:5173/dashboard",
  });
  const data = {
    message: "what are you doing",
    status: true,
  };
  response.end(JSON.stringify(data));
};
