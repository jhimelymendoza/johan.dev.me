import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleGenAI } from '@google/genai';
import { Ollama } from 'ollama';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project/project.schema';
import { Skills, SkillsSchema } from './project/skills.schema';
import { AI_PROVIDER } from './ai/ai-provider.interface';
import { GenAIService } from './ai/genai.service';
import { AnthropicService } from './ai/anthropic.service';
import { OllamaService } from './ai/ollama.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Skills.name, schema: SkillsSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Google GenAI client
    {
      provide: GoogleGenAI,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('GENAI_API_KEY');
        return new GoogleGenAI({ apiKey });
      },
    },
    // Ollama client
    {
      provide: Ollama,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isCloud = configService.get<string>('OLLAMA_CLOUD') === 'true';
        const host =
          configService.get<string>('OLLAMA_HOST') ?? 'http://localhost:11434';
        const apiKey = configService.get<string>('OLLAMA_API_KEY');

        return new Ollama({
          host,
          ...(isCloud && apiKey
            ? { headers: { Authorization: `Bearer ${apiKey}` } }
            : {}),
        });
      },
    },
    // AI provider implementations
    GenAIService,
    AnthropicService,
    OllamaService,
    // Active AI provider — switch between GenAIService, AnthropicService or OllamaService here
    {
      provide: AI_PROVIDER,
      useExisting: OllamaService,
    },
  ],
})
export class AppModule {}
