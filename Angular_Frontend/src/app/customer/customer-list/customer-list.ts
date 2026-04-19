import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '@app/services/customer.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CustomerDialog } from '../customer-dialog/customer-dialog';
import { ConfirmDialog } from '@app/shared/confirm-dialog/confirm-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList {
  customers: any[] = [];
  displayedColumns = ['name', 'mobile', 'email', 'status', 'actions'];

  constructor(
    private service: CustomerService,
    private dialog: MatDialog,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe((res) => (this.customers = res));
  }

  openDialog(customer?: any) {
    const dialogRef = this.dialog.open(CustomerDialog, {
      width: '50%',
      data: customer ?? null,
    });

    dialogRef.afterClosed().subscribe((r) => {
      if (r) this.load();
    });
  }

  delete(customer: any) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Delete Customer',
        message: `Are you sure you want to delete "${customer.customerName}"?`,
        confirmText: 'Yes',
        cancelText: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.delete(customer.customerId).subscribe(() => this.load());
      }
    });
  }

  get canAddCustomer(): boolean {
    return ['Admin', 'Manager'].includes(this.auth.user?.role);
  }
}
