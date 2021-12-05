const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const mqtt = require('mqtt');
const mainTopic = 'humidade';

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: 'expressjs',
    clean: true,
    connectTimeout: 4000,
    username: '',
    password: '',
    reconnectPeriod: 1000,
})

client.on('connect', () => {
    client.subscribe([mainTopic], () => {
        console.log(`Subscribe to topic '${mainTopic}'`)
    })
    client.on('message', (topic, payload) => {
        if(topic == mainTopic){
            io.emit('humidade', payload.toString());
        }
    })
})

app.get('/', (req, res) => {
    res.json({
        message: 'opa'
    });
});

io.on('connection', (socket) => {
  console.log('Usuario conectado');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});