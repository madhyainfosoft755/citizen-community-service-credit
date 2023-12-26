const application = require("express")();
const server = require("http").createServer(application);
const io = require("socket.io")(server);
const cors = require("cors");
// const { Server } = require("http");
application.use(cors());
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
	console.log("Server is running on port: " + PORT);
});

io.on("connection", (socket) => {
	socket.on("disconnect", () => {
		console.log("User disconnected - Username: " + socket.username);
	});

	socket.on("new_message", (msg) => {
		io.emit("send_message", { message: msg, user: socket.username });
	});

	socket.on("new_user", (usr) => {
		socket.username = usr;
		console.log("User connected - Username: " + socket.username);
	});
});

// wsServer.on("request", function (request) {
// 	var userID = getUniqueID();
// 	console.log("Web socket get connected using wsServer");
// 	// You can rewrite this part of the code to accept only the requests from allowed origin
// 	// const connection = request.accept(null, request.origin);..
// 	clients[userID] = connection;
// 	console.log(
// 		"connected: " + userID + " in " + Object.getOwnPropertyNames(clients)
// 	);
// });
