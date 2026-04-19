import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogClose } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '@app/services/customer.service';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-customer-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIcon, MatDialogClose,MatProgressSpinnerModule],
  templateUrl: './customer-dialog.html',
  styleUrl: './customer-dialog.scss',
})
export class CustomerDialog {
  form!: FormGroup; 
    loading = false;

  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
    customerId: [0],
    customerName: ['', Validators.required],
    mobile: ['', [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ]],
    email: ['', Validators.email],
    address: [''],
    isActive: [true]
  });
  }

   ngOnInit() {
     if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request =  this.service.save(this.form.value);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.form.value.customerId ? '✔ Customer updated successfully' 
                    : '✔ Customer saved successfully', '', {
          duration: 3000,
          panelClass: 'sucess-snack'
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Something went wrong', '', {
          duration: 3000,
          panelClass: 'error-snack'
        });
      }
    });
  }
}
