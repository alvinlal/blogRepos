const express = require("express");
const app = express();
const { Worker } = require("worker_threads");

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    //first argument is filename of the worker
    const worker = new Worker("./sumOfPrimesWorker.js", {
      workerData,
    });
    worker.on("message", resolve); //This promise is gonna resolve when messages comes back from the worker thread
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

function divideWorkAndGetSum() {
  // we are hardcoding the value 600000 for simplicity and dividing it
  //into 4 equal parts

  const start1 = 2;
  const end1 = 150000;
  const start2 = 150001;
  const end2 = 300000;
  const start3 = 300001;
  const end3 = 450000;
  const start4 = 450001;
  const end4 = 600000;
  //allocating each worker seperate parts
  const worker1 = runWorker({ start: start1, end: end1 });
  const worker2 = runWorker({ start: start2, end: end2 });
  const worker3 = runWorker({ start: start3, end: end3 });
  const worker4 = runWorker({ start: start4, end: end4 });
  //Promise.all resolve only when all the promises inside the array has resolved
  return Promise.all([worker1, worker2, worker3, worker4]);
}

app.get("/sumofprimeswiththreads", async (req, res) => {
  const startTime = new Date().getTime();
  const sum = await divideWorkAndGetSum()
    .then(
      (
        values //values is an array containing all the resolved values
      ) => values.reduce((accumulator, part) => accumulator + part.result, 0) //reduce is used to sum all the results from the workers
    )
    .then(finalAnswer => finalAnswer);

  const endTime = new Date().getTime();
  res.json({
    number: 600000,
    sum: sum,
    timeTaken: (endTime - startTime) / 1000 + " seconds",
  });
});

app.listen(7777, () => console.log("listening on port 7777"));
