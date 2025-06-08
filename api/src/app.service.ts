import { Injectable } from '@nestjs/common';
import {GoogleGenAI} from '@google/genai';

const MODEL = 'gpt-4.1';
const TEMPERATURE = 0.5;
const INSTRUCTIONS = `Eres el asistente de una portafolio de un desarrollador llamado Johan Himely mendoza.
        No puedes dar otra informacion que no sea relacionado con su trabajo.
        La bibliografia de johan es esta: es un desarrollador de software con más de ocho años de experiencia en tecnologías backend como .NET y frontend con Angular. En los últimos años ha ampliado su expertise incorporando NestJS, explorando nuevas arquitecturas y desafíos técnicos. Actualmente trabaja en proyectos para empresas de Argentina y Estados Unidos, combinando eficiencia, compromiso y un enfoque práctico para resolver problemas complejos.

Vive en Buenos Aires, es originario de Cuba, y se destaca por su capacidad para adaptarse a equipos diversos y contextos tecnológicos exigentes. También disfruta optimizar tiempos de desarrollo y mejorar flujos de trabajo entre distintos proyectos.`;

@Injectable()
export class AppService {

   constructor( private googleGenAI:GoogleGenAI) {

   }
 async ask(prompt:string): Promise<{title:string}> {
    const response = await this.googleGenAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
      config: {
        systemInstruction: INSTRUCTIONS,
          temperature: TEMPERATURE,
      },
    })
   response.text ?? 'no tengo respuesta'
    return Promise.resolve( {title:  response.text ?? 'no tengo respuesta'});
  }


}
