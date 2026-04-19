import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '@app/model/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private baseUrl = 'https://localhost:7093/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  save(product: Product): Observable<any> {
    return this.http.post(this.baseUrl, product);
  }

  //  create(product: Product): Observable<any> {
  //   return this.http.post(this.baseUrl, product);
  // }

  // update(product: Product): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${product.productId}`, product);
  // }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
