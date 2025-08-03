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
import { AuthService } from '../../services/auth-service';
import { CommonModule, Location } from '@angular/common';
import { AuthTokenService } from '../../component/auth-token.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private authTokenService: AuthTokenService
  ) {
    this.location.replaceState('');
  }

  signupForm = new FormGroup({
    email: new FormControl('oxford.apichat@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
  });

  onSubmit() {
    if (this.signupForm.valid) {
      // this.auth.login(this.signupForm.value).subscribe({
      //   next: (res) => {
      //     if (res.status == true) {
      //       this.authTokenService.setToken(res.token);
      //       Swal.fire({
      //         position: 'top-end',
      //         icon: 'success',
      //         title: res.message,
      //         showConfirmButton: false,
      //         timer: 1500,
      //       });

      this.router.navigate(['otp'], {
        queryParams: { email: this.signupForm.value.email },
      });
      //       this.signupForm.reset();
      //     } else {
      //       console.error('❌ Login error:', res.message);
      //       Swal.fire({
      //         position: 'top-end',
      //         icon: 'error',
      //         title: res.message,
      //         showConfirmButton: false,
      //         timer: 1500,
      //       });
      //     }
      //   },
      //   error: (err) => {
      //     console.error('❌ Login error:', err);
      //     Swal.fire({
      //       position: 'top-end',
      //       icon: 'error',
      //       title: JSON.stringify(err.error),
      //       showConfirmButton: false,
      //       timer: 1500,
      //     });
      //   },
      // });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/signin']);
  }
}
