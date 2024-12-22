import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'https://q7wh08wz8k.execute-api.us-east-1.amazonaws.com/dev/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${productId}`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(this.baseUrl, product);
  }

  updateProduct(productId: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${productId}`, product);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }
  
}


