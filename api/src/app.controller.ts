import {Controller, Get, Param, Query} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ask')
  ask(@Query('prompt') prompt: string): Promise<{title:string}  >{
    return this.appService.ask(prompt);
  }
}
