const express = require("express");
const app = express();

app.get("/", (req, res) => {
  for (let i = 0; i < 2e6; i++) {}
  res.send(`hello from server ${process.pid}`);
});

app.listen(4444, () => console.log("listening on port 4444"));
