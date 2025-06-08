import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import { v4 as uuidv4 } from 'uuid';
export type ProjectSchema= HydratedDocument<Project>
@Schema({ collection: 'project' })
export class Project {
    @Prop({ default: () => uuidv4() })
    _id: string;
    @Prop()
    name:string
    @Prop()
    description:string
    @Prop()
    startYear:number
    @Prop()
    endYear:number
    @Prop()
    company:string
    @Prop()
    role:string
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
