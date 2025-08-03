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
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../services/otp-service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  constructor(
    private otp: OtpService,
    private router: Router,
    private location: Location
  ) {
    this.location.replaceState('');
  }

  forgotPasswordForm = new FormGroup({
    email: new FormControl('oxford.apichat@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
  });

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.otp.getOtp(this.forgotPasswordForm.value).subscribe({
        next: (res) => {
          if (res.status == true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['otp'], {
              queryParams: {
                email: this.forgotPasswordForm.value.email,
                type: 'forgot-password',
              },
            });
            this.forgotPasswordForm.reset();
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
            title: JSON.stringify(err.error),
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/signin']);
  }
}
