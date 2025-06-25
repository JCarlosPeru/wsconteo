const WebSocket = require('ws');
const axios = require('axios');

// Puerto 8080, o el que tú configures en EasyPanel
const PORT = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

console.log(`🟢 Servidor WebSocket escuchando en puerto ${PORT}...`);

wss.on('connection', function connection(ws, req) {
  console.log(`Sensor conectado desde ${req.socket.remoteAddress}`);

  ws.on('message', async function incoming(data) {
    console.log('📥 Datos recibidos:', data.toString());

    try {
      // Envía al webhook HTTP de n8n
      await axios.post('https://TU_DOMINIO_O_IP_DE_N8N/webhook/conteo-personas', {
        payload: data.toString()
      });
    } catch (err) {
      console.error('❌ Error al enviar a n8n:', err.message);
    }
  });
});
