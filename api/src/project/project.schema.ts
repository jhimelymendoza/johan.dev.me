import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ collection: 'project' })
export class Project {
  @Prop({ default: () => uuidv4() })
  _id: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  front?: string;

  @Prop()
  back?: string;

  @Prop()
  devops?: string;

  @Prop()
  methodology?: string;

  @Prop()
  description:string

  @Prop({ type: [Number], default: [] })
  embeddings: number[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
