import {Controller, Get, Param, Put, Query} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ask')
  ask(@Query('prompt') prompt: string): Promise<IChat >{
    return this.appService.ask(prompt);
  }


  @Put('set-embedding-to-skills/:id')
  setEmbedding(@Param('id') id: string){
    return this.appService.setEmbeddingsByProjectId(id);
  }


  @Get('compare')
  compare(@Query('question') question: string){
    return this.appService.hasAnyOfQuestionSkills(question);
  }

}
