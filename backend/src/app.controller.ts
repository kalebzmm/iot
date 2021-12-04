import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://localhost', {
  clientId: 'nestjs',
  clean: true,
  connectTimeout: 8000,
  username: '',
  password: '',
  reconnectPeriod: 1000,
})

client.on('connect', () => {
  console.log('Connected')
  client.subscribe(['temperatura'], () => {
    console.log(`Subscribe to topic 'temperatura'`)
  })
})

client.on('message', (topic, payload) => {
  console.log('Temperatura do solo:', payload.toString(), '%')
})

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('teste')
  getHello(): string {
    console.log('GET ' + Date.now().toLocaleString())
    return this.appService.getHello();
  }

  @Post('teste')
  postHello(): string {
    console.log('POST ' + Date.now().toLocaleString())
    return this.appService.getHello();
  }
}
