import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';
import { Product } from '@app/model/product';
import { ProductDialog } from '../product-dialog/product-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialog } from '@app/shared/confirm-dialog/confirm-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  displayedColumns = ['name', 'price', 'gst', 'status', 'actions'];
  products: Product[] = [];

  constructor(
    private service: ProductService,
    private dialog: MatDialog,
    public auth:AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.service.getAll().subscribe((res) => (this.products = res));
  }

  openDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '45%',
      data: product ?? null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadProducts();
    });
  }

  delete(product: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: `Are you sure you want to delete "${product.productName}"?`,
        confirmText: 'Yes',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.delete(product.productId).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  get canAddProduct(): boolean {
    return ['Admin', 'Manager'].includes(this.auth.user?.role);
  }
}
