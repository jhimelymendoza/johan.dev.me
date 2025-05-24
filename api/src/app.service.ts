import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {title:string} {
    return {title:'Hola mundo'};
  }
}
