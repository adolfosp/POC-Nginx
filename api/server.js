const express = require("express");
const app = express();
const port = 3000;

// endpoint raiz
app.get("/", (req, res) => {
  res.json({ message: "Hello from API!" });
});

// endpoint de teste
app.get("/ping", (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API running at http://0.0.0.0:${port}`);
});
