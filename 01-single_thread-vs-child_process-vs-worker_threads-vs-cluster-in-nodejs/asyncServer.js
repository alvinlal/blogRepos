const express = require("express");
const app = express();
const fetch = require("node-fetch"); //node-fetch is a library used to make http request in nodejs.

app.get("/calltoslowserver", async (req, res) => {
  const result = await fetch("http://localhost:5000/slowrequest"); //fetch returns a promise
  const resJson = await result.json();
  res.json(resJson);
});

app.get("/testrequest", (req, res) => {
  res.send("I am unblocked now");
});

app.listen(4000, () => console.log("listening on port 4000"));
