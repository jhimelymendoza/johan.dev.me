import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MODULES, MONGO_CONFIG } from './config';
import AI_SERVICES from './ai';
import EMBEDDING_SERVICES from './ai/embedding';

@Module({
  imports: [...MONGO_CONFIG, ...MODULES],
  controllers: [AppController],
  providers: [AppService, ...AI_SERVICES, ...EMBEDDING_SERVICES],
})
export class AppModule {}
