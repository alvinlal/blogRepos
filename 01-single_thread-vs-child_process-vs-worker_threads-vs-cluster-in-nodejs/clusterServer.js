const cluster = require("cluster");
const http = require("http");
const cpuCount = require("os").cpus().length; //returns no of cores our cpu have

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

function masterProcess() {
  console.log(`Master process ${process.pid} is running`);

  //fork workers.

  for (let i = 0; i < cpuCount; i++) {
    console.log(`Forking process number ${i}...`);
    cluster.fork(); //creates new node js processes
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork(); //forks a new process if any process dies
  });
}

function childProcess() {
  const express = require("express");
  const app = express();
  //workers can share TCP connection

  app.get("/", (req, res) => {
    res.send(`hello from server ${process.pid}`);
  });

  app.listen(5555, () =>
    console.log(`server ${process.pid} listening on port 5555`)
  );
}
