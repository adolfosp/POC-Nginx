import http from 'k6/http';
import ws from 'k6/ws';
import { sleep } from 'k6';

export let options = {
  vus: 50,
  duration: '30s',
};

export default function () {

  // 1️⃣ Negotiate
  let negotiate = http.post(
    'http://localhost:8089/hub/negotiate?negotiateVersion=1'
  );

  if (negotiate.status !== 200) {
    console.log("Negotiate falhou:", negotiate.status);
    return;
  }

  let connectionId = negotiate.json('connectionId');

  // 2️⃣ Conectar WebSocket com id
  const url = `ws://localhost:8089/hub?id=${connectionId}`;

  ws.connect(url, {}, function (socket) {

    socket.on('open', function () {
      console.log('WebSocket conectado');

      const handshake = JSON.stringify({
        protocol: "json",
        version: 1
      }) + "\x1e";

      socket.send(handshake);
    });

    socket.on('error', function (e) {
      console.log('Erro:', e.error());
    });

    socket.on('close', function () {
      console.log('Conexão fechada');
    });

    sleep(5);
  });
}
