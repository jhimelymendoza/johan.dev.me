import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import OpenAI from "openai";
import {GoogleGenAI} from "@google/genai";

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService,  {
    provide: OpenAI,
    useFactory: (configService: ConfigService) => {
      const apiKey = configService.get<string>('OPENAI_API_KEY');
      return new OpenAI({ apiKey });
    },
    inject: [ConfigService],
  },
    {
      provide: GoogleGenAI,
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('GENAI_API_KEY');
        return new GoogleGenAI({apiKey:apiKey});
      },
      inject: [ConfigService],
    }],

})
export class AppModule {}
