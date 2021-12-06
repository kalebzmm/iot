const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const mqtt = require('mqtt');
const mainTopic = 'humidade';
const irrigacaoTopic = 'irrigacao';

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
    client.subscribe([mainTopic, irrigacaoTopic], () => {
        console.log(`Inscrito nos topicos '${mainTopic}' e '${irrigacaoTopic}'`)
    })
    client.on('message', (topic, payload) => {
        if(topic == mainTopic){
            io.emit('humidade', payload.toString());
        }else if(topic == irrigacaoTopic){
            io.emit('irrigacao', payload.toString());
        }
    })
})

app.get('/', (req, res) => {
    res.json({
        message: 'opa'
    });
});

io.on('connection', (socket) => {
    socket.on('irrigacao', (comando) => {
        switch(comando){
            case '1':
                console.log("LIGAR");
                client.publish('irrigacao', '1');
                break;
            case '0':
                console.log("DESLIGAR");
                client.publish('irrigacao', '0');
                break;
            default:
                console.log("COMANDO INVALIDO:", comando);
        }
    });
    console.log('Usuario conectado');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});