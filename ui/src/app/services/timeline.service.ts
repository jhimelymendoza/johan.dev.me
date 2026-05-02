import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { TimelineEntry } from '../dto/timeline.interface';

@Injectable({providedIn: 'root'})
export class TimelineService {
  httpClient=inject(HttpClient);

  getProjects():Observable<TimelineEntry[]>{
    return this.httpClient.get<TimelineEntry[]>('http://localhost:3000/projects');
  }
}