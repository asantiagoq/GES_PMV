import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalidaService {
  private apiBaseUrl = 'https://s2nzokwsie.execute-api.us-east-1.amazonaws.com/dev/outbound-notes';

  constructor(private http: HttpClient) {}


  getAllNotas(): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}`);
  }


  getNotaById(noteId: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/${noteId}`);
  }

  createNota(nota: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}`, nota);
  }

  updateNota(noteId: string, nota: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/${noteId}`, nota);
  }

  deleteNota(noteId: string): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/${noteId}`);
  }

  getNotaFile(noteId: string): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/${noteId}/file`, { responseType: 'blob' });
  }

  getProductDetails(productId: string): Observable<any> {
    return this.http.get<any>(`https://q7wh08wz8k.execute-api.us-east-1.amazonaws.com/dev/products/${productId}`);
  }
  
  getAllProducts(): Observable<any[]> {
    const productApiUrl = 'https://q7wh08wz8k.execute-api.us-east-1.amazonaws.com/dev/products'; 
    return this.http.get<any[]>(productApiUrl);
  }
  
  
}
