const WebSocket = require('ws');

const ports = [5001, 5002, 5003, 5004, 5005];
const servers = ports.map(port => new WebSocket.Server({ port }));

servers.forEach((server, index) => {
    server.on('connection', ws => {
        ws.on('message', message => {
            message = JSON.parse(message);

            if (message.type === "name") {
                ws.personName = message.data;
                return;
            }

            console.log(`Received on server ${ports[index]}: ${message.data}`);

            server.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        name: ws.personName,
                        data: message.data
                    }));
                }
            });
        });

        ws.on('close', () => {
            console.log(`Client disconnected from server on port ${ports[index]}`);
        });
    });

    console.log(`WebSocket server running on port ${ports[index]}`);
});
