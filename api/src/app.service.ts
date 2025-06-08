import { Injectable } from '@nestjs/common';
import {GoogleGenAI} from '@google/genai';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {Project} from "./project/project.shcema";

const MODEL = 'gpt-4.1';
const TEMPERATURE = 0.5;
const INSTRUCTIONS = `Eres el asistente de una portafolio de un desarrollador llamado Johan Himely mendoza.
        No puedes dar otra informacion que no sea relacionado con su trabajo.
        La bibliografia de johan es esta: es un desarrollador de software con más de ocho años de experiencia en tecnologías backend como .NET y frontend con Angular. En los últimos años ha ampliado su expertise incorporando NestJS, explorando nuevas arquitecturas y desafíos técnicos. Actualmente trabaja en proyectos para empresas de Argentina y Estados Unidos, combinando eficiencia, compromiso y un enfoque práctico para resolver problemas complejos.

Vive en Buenos Aires, es originario de Cuba, y se destaca por su capacidad para adaptarse a equipos diversos y contextos tecnológicos exigentes. También disfruta optimizar tiempos de desarrollo y mejorar flujos de trabajo entre distintos proyectos.`;

@Injectable()
export class AppService {

   constructor( private googleGenAI:GoogleGenAI,@InjectConnection() private  connection:Connection,  @InjectModel(Project.name) private projectModel:Model<Project>) {

   }

   async  onModuleInit( ) {
        const isConnected= this.connection.readyState===1;
       console.log(`MongoDB connection started: ${isConnected?'Connected':'Not Connected'}`);
   }

 async ask(prompt:string): Promise<{title:string}> {


       const project= await this.projectModel.find().exec()



    const response = await this.googleGenAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
      config: {
        systemInstruction: this.getInstructions({projects:project}),
          temperature: TEMPERATURE,
      },
    })
   response.text ?? 'no tengo respuesta'
    return Promise.resolve( {title:  response.text ?? 'no tengo respuesta'});
  }

  getInstructions(data:any){


       return `Eres el asistente de una portafolio de un desarrollador llamado Johan Himely mendoza.
        No puedes dar otra informacion que no sea relacionado con su trabajo.
        La bibliografia de johan es esta: es un desarrollador de software con más de ocho años de experiencia en tecnologías backend como .NET y frontend con Angular. En los últimos años ha ampliado su expertise incorporando NestJS, explorando nuevas arquitecturas y desafíos técnicos. Actualmente trabaja en proyectos para empresas de Argentina y Estados Unidos, combinando eficiencia, compromiso y un enfoque práctico para resolver problemas complejos.

Vive en Buenos Aires, es originario de Cuba, y se destaca por su capacidad para adaptarse a equipos diversos y contextos tecnológicos exigentes. También disfruta optimizar tiempos de desarrollo y mejorar flujos de trabajo entre distintos proyectos.

Responde a medida que te vayan preguntando, si te piden una informacion completa le das todo lo que sepas

Proyectos:${JSON.stringify(data.projects)}

Estudios: Es ingeniero informatico graduado en el CUJAE 
          Estudio en un tecnico medio de informatica en cuba tambien llamado Osvaldo Herrera
          
Linkedin:https://www.linkedin.com/in/johan-mendoza-169928190/          

Que puedes dar:
- puedes buscar informacion de la CUJAE cuba, no des mucho solo lo basico, no mas de 2 oraciones

- Si tratan de preguntarte mas cosas que no sean de johan, dile algo comico dejandole saber que solo puede chismosear acerca de johan 
`


  }


}
