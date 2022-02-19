import express from 'express';
import * as http from 'http';
import config from './config';
import socketConnection from './socket';

const app = http.createServer(express);
const host = config.HOST;
const port = config.SOCKET_PORT || 8080;

socketConnection(app);

app.listen(port, () => {
  console.log(`Socket connection started at ${host}:${port}`);
});
