const { workerData, parentPort } = require("worker_threads");

const start = workerData.start;
const end = workerData.end;

var sum = 0;
for (var i = start; i <= end; i++) {
  for (var j = 2; j <= i / 2; j++) {
    if (i % j == 0) {
      break;
    }
  }
  if (j > i / 2) {
    sum += i;
  }
}

parentPort.postMessage({
  start: start,
  end: end,
  result: sum,
});
