import express from "express";
import config from "./config";

const app = express();
const host = config.HOST;
const port = config.PORT || 8080;
const apiVersion = config.API_VERSION;

app.listen(port, () => {
  console.log(`Server started at ${host}:${port}/api/${apiVersion}/`);
});
