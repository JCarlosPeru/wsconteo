const WebSocket = require('ws');
const axios = require('axios');

const PORT = 8090; // 👈 forzamos manualmente el puerto 8080

const wss = new WebSocket.Server({ port: PORT });

console.log(`🟢 Servidor WebSocket escuchando en puerto ${PORT}...`);

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`✅ Sensor conectado desde ${ip}`);

  ws.send("OK"); // 👈 Enviamos "OK" inmediatamente
  console.log('📤 Enviado: OK');

  ws.on('message', async function incoming(data) {
    console.log('📥 Datos recibidos:', data.toString());

    try {
      await axios.post('https://TUN8N/webhook/conteo-personas', {
        payload: data.toString()
      });
    } catch (err) {
      console.error('❌ Error al enviar a n8n:', err.message);
    }
  });
});

