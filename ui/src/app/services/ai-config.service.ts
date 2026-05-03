import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {catchError, of} from 'rxjs';
import {environment} from '../../environments/environment';

export interface AiConfig {
  provider: string;
  chatModel: string;
  embeddingModel: string;
}

@Injectable({providedIn: 'root'})
export class AiConfigService {
  httpClient = inject(HttpClient);

  config = signal<AiConfig | null>(null);
  loading = signal(true);
  error = signal('');

  fetchConfig() {
    this.loading.set(true);
    this.httpClient.get<AiConfig>(`${environment.apiUrl}/ai-config`).pipe(
      catchError(err => {
        this.error.set('Error al cargar configuración');
        this.loading.set(false);
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.config.set(data);
      }
      this.loading.set(false);
    });
  }
}
