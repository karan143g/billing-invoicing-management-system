import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormGroup } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIcon, MatDialogClose,MatProgressSpinnerModule],
  templateUrl: './product-dialog.html',
  styleUrl: './product-dialog.scss',
})
export class ProductDialog {

  loading = false;
  form!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      productId: [0],
    productName: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    gstPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
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
        this.snackBar.open(this.form.value.productId ? '✔ Product updated successfully' 
                    : '✔ Product saved successfully', '', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass:'sucess-snack'
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Something went wrong', '', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass:'error-snack'
        });
      }
    });
  }
}
