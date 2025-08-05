// necessary modules
const express = require('express');  //web framework for routes and middleware
const http = require('http');  //node module for creating server
const {Server} = require('socket.io'); // websocket server for real-time communication
const cors = require('cors'); // middleware to enable cors

const app = express();   
const server = http.createServer(app);


// Init socket.io server and config cors
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());

let tasks = [];

//Handle socket connections
io.on('connection', (socket) => {
    console.log("User connect:", socket.id);

    socket.emit('task_update', tasks);

    // Listen for task updates from a client
    socket.on('task_update', (data) => {
        tasks = data;
        console.log('Users Added Task:', socket.id);
        socket.broadcast.emit('task_update', tasks); //share task updates real-time

    });

    // log when users disconnect
    socket.on('disconnect', () => {
        console.log('User disconnect:', socket.id);
    });
});

//start the server
const PORT = 4000;
server.listen(PORT, () => console.log(`Running server on port ${PORT}`));