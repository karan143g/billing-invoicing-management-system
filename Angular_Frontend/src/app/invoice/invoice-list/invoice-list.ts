import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '@app/model/product';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialog } from '@app/shared/confirm-dialog/confirm-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomerService } from '@app/services/customer.service';
import { InvoiceService } from '@app/services/invoice.service';
import { InvoiceView } from '../invoice-view/invoice-view';

@Component({
  selector: 'app-invoice-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
})
export class InvoiceList {
  filterForm: FormGroup;
  customers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    this.filterForm = this.fb.group({
      invoiceNo: [''],
      customerId: ['0'],
      fromDate: [threeMonthsAgo],
      toDate: [new Date()],
    });
  }

  invoices: any[] = [];
  displayedColumns = ['invoiceNo', 'date', 'customer', 'total', 'actions'];

  ngOnInit() {
    this.customerService.getAll().subscribe((res) => (this.customers = res));
  }

  loadInvoices() {
    const f = this.filterForm.value;

    const params = {
      invoiceNo: f.invoiceNo,
      customerId: f.customerId,
      fromDate: f.fromDate ? this.formatDate(f.fromDate) : null,
      toDate: f.toDate ? this.formatDate(f.toDate) : null,
    };

    this.invoiceService
      .getInvoices(params)
      .subscribe((res) => (this.invoices = res));
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  viewInvoice(invoiceId: number) {
      const dialogRef = this.dialog.open(InvoiceView, {
            width: '50%',
            data: invoiceId ?? null
      });
  }
}
