const express = require("express");
const app = express();

app.get("/isprime", async (req, res) => {
  const startTime = new Date();
  const result = await isPrime(parseInt(req.query.number)); //parseInt is for converting string to number
  const endTime = new Date();
  res.json({
    number: parseInt(req.query.number),
    isprime: result,
    time: endTime.getTime() - startTime.getTime() + "ms",
  });
});

app.get("/testrequest", (req, res) => {
  res.send("I am unblocked now");
});

const isPrime = number => {
  return new Promise(resolve => {
    let isPrime = true;
    for (let i = 3; i < number; i++) {
      if (number % i === 0) {
        isPrime = false;
        break;
      }
    }

    resolve(isPrime);
  });
};

app.listen(3000, () => console.log("listening on port 3000"));
