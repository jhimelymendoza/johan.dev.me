import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Skills, SkillsSchema } from '../project/skills.schema';

export const MONGO_CONFIG = [
  ConfigModule.forRoot(),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_DB'),
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([{ name: Skills.name, schema: SkillsSchema }]),
];