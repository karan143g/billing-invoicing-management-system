import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '@app/model/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {

  private baseUrl = 'https://localhost:7093/api/customers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

//   create(customer: Customer) {
//     return this.http.post(this.baseUrl, customer);
//   }

//   update(customer: Customer) {
//     return this.http.put(`${this.baseUrl}/${customer.customerId}`, customer);
//   }

  save(customer: Customer): Observable<any> {
      return this.http.post(this.baseUrl, customer);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
