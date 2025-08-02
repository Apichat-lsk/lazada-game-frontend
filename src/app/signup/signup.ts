import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../util/otp-service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  constructor(
    private otp: OtpService,
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
    email: new FormControl('oxford.apichat@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    tel: new FormControl('0622488881', [
      Validators.required,
      Validators.pattern(/^(0|(\+66))[0-9]{8,9}$/),
    ]),
  });

  onSubmit() {
    if (this.signupForm.valid) {
      this.otp.send(this.signupForm.value).subscribe({
        next: (res) => {
          if (res.check == true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.signupForm.reset();
            this.router.navigate(['/otp']);
          } else {
            console.error('❌ Register error:', res.message);
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
          console.error('❌ Register error:', err);
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
