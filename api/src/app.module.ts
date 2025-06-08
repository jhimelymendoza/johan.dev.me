import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {GoogleGenAI} from "@google/genai";
import {MongooseModule} from "@nestjs/mongoose";
import {Project, ProjectSchema} from "./project/project.shcema";





@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_DB'),
    }),
    inject: [ConfigService],
  }),
    MongooseModule.forFeature([{name: Project.name, schema: ProjectSchema}]),

  ],
  controllers: [AppController],
  providers: [AppService,
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
