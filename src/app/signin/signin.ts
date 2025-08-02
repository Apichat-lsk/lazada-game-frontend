import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../util/auth-service';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.location.replaceState('');
  }

  signupForm = new FormGroup({
    username: new FormControl('admin', [
      Validators.required,
      Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.pattern(/^[ก-๏A-Za-z0-9\s!@#$%^&*]{6,}$/),
    ]),
  });

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Data:', this.signupForm.value);
      this.auth.login(this.signupForm.value).subscribe({
        next: (res) => {
          if (res.status == true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.signupForm.reset();
            this.router.navigate(['/home']);
          } else {
            console.error('❌ Login error:', res.message);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        },
        error: (err) => {
          console.error('❌ Login error:', err);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: err.error,
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/index']);
  }
}
