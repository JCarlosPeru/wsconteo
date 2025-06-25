const WebSocket = require('ws');
const axios = require('axios');

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

console.log(`🟢 Servidor WebSocket escuchando en puerto ${PORT}...`);

wss.on('connection', function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  console.log(`✅ Sensor conectado desde ${ip}`);

  // Enviamos la confirmación "OK"
  ws.send("OK");
  console.log('📤 Enviado: OK');

  // Escuchamos los datos enviados por el sensor
  ws.on('message', async function incoming(data) {
    console.log('📥 Datos recibidos:', data.toString());

    try {
      // Reenvío al webhook de n8n
      await axios.post('https://75.119.145.36/webhook/conteo-personas', {
        payload: data.toString()
      });
    } catch (err) {
      console.error('❌ Error al enviar a n8n:', err.message);
    }
  });
});
