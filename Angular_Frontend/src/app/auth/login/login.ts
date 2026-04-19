import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/services/auth.service';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule, MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loading = false;

  form:FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
     this.form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  }

  login() {
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.snack.open('Login successful', '', { duration: 3000 , panelClass: 'sucess-snack' });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.snack.open('Invalid username or password', '', { duration: 3000 , panelClass: 'error-snack', });
      }
    });
  }
}
