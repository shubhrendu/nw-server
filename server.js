const webSocketServer = require("websocket").server; 
const http = require("http");
const tcpPortUsed = require("tcp-port-used");
const fs = require('fs');

const clientIp = Object.values(require("os").networkInterfaces())
	.flat()
	.filter(item => !item.internal && item.family === "IPv4")
	.find(Boolean).address;

let actualPort;

const server = http.createServer((req, res) => {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write("<h1>Server Address: </h1>" + `ws://${clientIp}:${actualPort}`);
	res.end();
});


const startServer = async () => {
	for (let port = 3001; port <= 9000; port++) {
		try {
			const inUse = await tcpPortUsed.check(port);
			console.log("Port " + port + " usage: ", inUse);
			if (!inUse) {
				server.listen(port, () => {
					actualPort = port;
					const content = `Server started at address: ws://${clientIp}:${port}`;
					console.log(content);					
					fs.writeFile('./server.html', "<h1>" + content + "</h1>", err => {
						if (err) {
							console.error(err);
						}					
					});
				});
				break;
			}
		} catch (err) {
			console.error("Error on check:", err.message);
		}
	}
};
startServer();

const wsServer = new webSocketServer({
	httpServer: server
});

const getUniqueID = () => {
	const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	return s4() + '-' + s4();
}

const clients = {};

const sendMessage = (json) => {
	Object.keys(clients).map(client => {
		clients[client].sendUTF(json);
	});
}

wsServer.on("request", request => {
	let userId = getUniqueID();
	console.log((new Date()) + " Received a new connection request from origin " + request.origin);
	const connection = request.accept(null, request.origin);
	clients[userId] = connection;
	console.log("Coonected: " + userId + " in " + Object.getOwnPropertyNames(clients));

	connection.on("message", (message) => {		
		const data = JSON.parse(message.utf8Data);
		console.log("Message received from client ", data.content);
		fs.writeFile('./server.html', "<h1>" + data.content + "</h1>", err => {
			if (err) {
				console.error(err);
			}					
		});
		const json = { data: { editorContent: "Received: '" + data.content + "' at server." }};
		sendMessage(JSON.stringify(json));
		
	});

	connection.on("close", connection => {
		console.log((new Date()) + " Client " + userId + " disconnected.");
	});
});