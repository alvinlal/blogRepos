const express = require("express");
const app = express();

function sumOfPrimes(n) {
  var sum = 0;
  for (var i = 2; i <= n; i++) {
    for (var j = 2; j <= i / 2; j++) {
      if (i % j == 0) {
        break;
      }
    }
    if (j > i / 2) {
      sum += i;
    }
  }
  return sum;
}

app.get("/sumofprimes", (req, res) => {
  const startTime = new Date().getTime();
  const sum = sumOfPrimes(req.query.number);
  const endTime = new Date().getTime();
  res.json({
    number: req.query.number,
    sum: sum,
    timeTaken: (endTime - startTime) / 1000 + " seconds",
  });
});

app.listen(6767, () => console.log("listening on port 6767"));
