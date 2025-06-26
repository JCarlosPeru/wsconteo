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

  ws.on('message', async (data) => {
    try {
      const payload = data.toString();

      // Opcional: Validar que el mensaje empieza con lo esperado
      //if (!payload.startsWith("Published =>")) {
      //  console.log("❌ Formato inesperado, ignorado.");
      //  return;
      //}

      // Enviar a n8n webhook
      const response = await axios.post('https://iaprods-01-iaprodsn8n.6ui5el.easypanel.host/webhook/conteo-personas', {
        payload: payload
      });

      console.log("✅ Datos enviados a n8n con éxito:", response.status);
    } catch (error) {
      console.error("❌ Error al enviar a n8n:", error.message);
    }
  });
});

