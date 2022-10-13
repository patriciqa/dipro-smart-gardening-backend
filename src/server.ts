import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import buildingRouter from "./routes/buildingRoutes";

const app = express();
const port = 3000; // default port to listen

let corsOptions = {
  origin: ['http://localhost:3000']
}

app.use(cors(corsOptions));

app.use(buildingRouter);
// start the express server
const certDir = path.join(__dirname, "..", "cert");
const certPath = path.join(certDir, "fullchain.pem");
const keyPath = path.join(certDir, "privkey.pem");

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const sslServerOptions = {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  };
  https.createServer(sslServerOptions, app).listen(443, () => {
    // tslint:disable-next-line:no-console
    console.log("server started with HTTPS");
  });

  // Redirect all HTTP -> HTTPS
  const httpRedirect = express();
  httpRedirect.use((request, response) => response.redirect("https://" + request.headers.host + request.url));
  httpRedirect.listen(port);
} else {
  app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
  });
}
