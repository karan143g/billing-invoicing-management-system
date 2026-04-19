import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '@app/services/customer.service';
import { ProductService } from '@app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InvoiceService } from '@app/services/invoice.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormGroup } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-invoice-creation',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltip,
  ],
  templateUrl: './invoice-creation.html',
  styleUrl: './invoice-creation.scss',
})
export class InvoiceCreation {
  invoiceForm: FormGroup;
  itemForm: FormGroup;
  customers: any[] = [];
  products: any[] = [];
  items: any[] = [];

  dataSource: any;

  subTotal = 0;
  gstTotal = 0;
  grandTotal = 0;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNo: [null],
      customerId: [null, Validators.required],
      invoiceDate: [new Date(), Validators.required],
      subTotal: [0],
      gstTotal: [0],
      grandTotal: [0],
    });

    this.itemForm = this.fb.group({
      productId: [null, Validators.required],
      qty: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.customerService.getAll().subscribe((res) => (this.customers = res));
    this.productService.getAll().subscribe((res) => (this.products = res));
  }

  //   addItem() {
  //     if (this.itemForm.invalid) return;

  //     const product = this.products.find(
  //       p => p.productId === this.itemForm.value.productId
  //     );

  //     const qty = this.itemForm.value.qty!;
  //     const amount = qty * product.price;
  //     const gstAmount = amount * (product.gstPercent / 100);
  //     const total = amount + gstAmount;

  //     this.items = [...this.items, {
  //   productId: product.productId,
  //   productName: product.productName,
  //   qty,
  //   rate: product.price,
  //   gstPercent: product.gstPercent,
  //   amount,
  //   gstAmount,
  //   total
  // }];

  //     this.calculateTotals();
  //     this.itemForm.reset({ qty: 1 });
  //   }

  addItem() {
    if (this.itemForm.invalid) return;

    const product = this.products.find(
      (p) => p.productId === this.itemForm.value.productId
    );
    if (!product) return;

    const qty = this.itemForm.value.qty!;

    const existingIndex = this.items.findIndex(
      (i) => i.productId === product.productId
    );

    let updatedItems = [...this.items];

    if (existingIndex !== -1) {
      const existing = updatedItems[existingIndex];
      const newQty = existing.qty + qty;

      const amount = newQty * existing.rate;
      const gstAmount = amount * (existing.gstPercent / 100);
      const total = amount + gstAmount;

      updatedItems[existingIndex] = {
        ...existing,
        qty: newQty,
        amount,
        gstAmount,
        total,
      };
    } else {
      const amount = qty * product.price;
      const gstAmount = amount * (product.gstPercent / 100);
      const total = amount + gstAmount;

      updatedItems.push({
        productId: product.productId,
        productName: product.productName,
        qty,
        rate: product.price,
        gstPercent: product.gstPercent,
        amount,
        gstAmount,
        total,
      });
    }

    this.items = updatedItems;
    this.calculateTotals();
    this.itemForm.reset({ qty: 1 });
  }

  removeItem(index: number) {
    this.items = this.items.filter((_, i) => i !== index);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subTotal = this.items.reduce((a, b) => a + b.amount, 0);
    this.gstTotal = this.items.reduce((a, b) => a + b.gstAmount, 0);
    this.grandTotal = this.subTotal + this.gstTotal;

    this.invoiceForm.patchValue({
      subTotal: this.subTotal,
      gstTotal: this.gstTotal,
      grandTotal: this.grandTotal,
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  saveInvoice() {
    // if (this.invoiceForm.invalid || this.items.length === 0) {
    //   this.snackBar.open('Please add customer and items', '', {
    //     duration: 3000,
    //     panelClass: 'error-snack'
    //   });
    //   return;
    // }

    if (this.invoiceForm.invalid) {
      this.snackBar.open('Please fill invoice details', '', {
        duration: 3000,
        panelClass: 'error-snack',
      });
      return;
    }

    if (this.items.length === 0) {
      this.snackBar.open('Add at least one product', '', {
        duration: 3000,
        panelClass: 'error-snack',
      });
      return;
    }

    // const payload = {
    //   ...this.invoiceForm.value,
    //   items: this.items,
    //   subTotal: this.subTotal,
    //   gstTotal: this.gstTotal,
    //   grandTotal: this.grandTotal
    // };

    const payload = {
      ...this.invoiceForm.value,
      invoiceDate: this.formatDate(this.invoiceForm.value.invoiceDate),
      items: this.items,
    };

    console.log('payload', payload);
    console.log('invoicedate', this.invoiceForm.value.invoiceDate);

    // this.invoiceService.save(payload).subscribe(() => {
    //   this.snackBar.open('Invoice saved successfully', '', {
    //     duration: 3000,
    //     panelClass: 'sucess-snack'
    //   });
    //   this.reset();
    // });
    this.invoiceService.save(payload).subscribe({
      next: (res) => {
        this.snackBar.open(
          `✔ Invoice ${res.invoiceNo} created successfully`,
          '',
          {
            duration: 3000,
            panelClass: 'sucess-snack',
          }
        );
        this.reset();
      },
      error: () => {
        this.snackBar.open('Failed to save invoice', '', {
          duration: 3000,
          panelClass: 'error-snack',
        });
      },
    });
  }

  reset() {
    this.invoiceForm.reset({ invoiceDate: new Date() });
    this.itemForm.reset({ qty: 1 });
    this.items = [];
    this.subTotal = this.gstTotal = this.grandTotal = 0;
  }
}
