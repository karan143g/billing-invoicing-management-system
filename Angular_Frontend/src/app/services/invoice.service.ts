import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '@app/model/invoice';
import { InvoiceSaveResponse } from '@app/model/invoice';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseUrl = 'https://localhost:7093/api/invoices';

  constructor(private http: HttpClient) {}

  //   save(invoice: any) {
  //     return this.http.post(this.baseUrl, invoice);
  //   }

  getInvoices(params: any): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { params });
    //return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getInvoiceById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  save(payload: any) {
    return this.http.post<InvoiceSaveResponse>(this.baseUrl, payload);
  }
}
