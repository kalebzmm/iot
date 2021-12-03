import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

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
