// necessary modules
const express = require('express');  //web framework for routes and middleware
const http = require('http');  //node module for creating server
const {Server} = require('Socket.io'); // websocket server for real-time communication
const cors = require('cors'); // middleware to enable cors

const app = express();   
const server = http.createServer(app);


// Init socket.io server and config cors

const io = new Server(server, {
    cors: {
        orgin: '*', //requests from any orgin, not sucure
    },
});


app.use(cors());

//Handle socket connections
io.on('connection', (socket) => {
    console.log("User connect:", socket.id);

    // Listen for task updates from a client
    socket.on('task_update', (data) => {
        socket.broadcast.emit('taask_updte', data); //share task updates real-time
    });

    // log when users disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

//start the server
const PORT = 4000;
server.listening(PORT, () => console.log(`Running server on port ${PORT}`));
