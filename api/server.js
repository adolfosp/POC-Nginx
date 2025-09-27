const express = require("express");
const app = express();
const port = 3000;

// endpoint raiz - consome muita CPU e memória
app.get("/", (req, res) => {
  console.log("Gerando carga pesada...");

  // Consumo de memória: cria um array grande
  const bigArray = [];
  for (let i = 0; i < 50_000_000; i++) {
    bigArray.push(i);
    if (i % 5_000_000 === 0) {
      // log intermediário para ver progresso
      console.log(`Array preenchido até ${i}`);
    }
  }

  // Consumo de CPU: cálculo pesado
  let total = 0;
  for (let i = 0; i < 1e8; i++) {
    total += Math.sqrt(i);
  }

  res.json({
    message: "Carga pesada concluída",
    arrayLength: bigArray.length,
    total: total,
  });
});


// endpoint de teste
app.get("/ping", (req, res) => {
  res.json({ pong: true, time: new Date().toISOString() });
});

// endpoint que simula erro 104 (reset da conexão)
app.get("/reset", (req, res) => {
  console.log("Forçando reset da conexão no /reset");

  // força reset TCP enviando RST
  req.socket.destroy(new Error("Connection reset by peer"));
  // não envia resposta
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API running at http://0.0.0.0:${port}`);
});
