import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
export type SkillsSchema = HydratedDocument<Skills>;
@Schema({ collection: 'skills' })
export class Skills {
  @Prop({ default: () => uuidv4() })
  _id: string;
  @Prop()
  name: string;
  @Prop({ type: [Number] })
  embeddings: number[];
}

export const SkillsSchema = SchemaFactory.createForClass(Skills);
