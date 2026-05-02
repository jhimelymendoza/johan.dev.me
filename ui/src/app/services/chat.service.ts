import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { IChat } from '../dto/chat.interface';

@Injectable({providedIn: 'root'})
export class ChatService {
  httpClient=inject(HttpClient);




  ask(question:string):Observable<IChat>{
    return this.httpClient.get<IChat>(`http://localhost:3000/ask?prompt=${question}`);
  }
}
