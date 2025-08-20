import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
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
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  signupForm!: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private authTokenService: AuthTokenService,
    private fb: FormBuilder
  ) {
    this.location.replaceState('');

    this.signupForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          // Validators.pattern(/^[a-zA-Z0-9]+$/) || Validators.email,
        ],
      ],
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z0-9\s!@#$%^&*]{6,}$/),
      ]),
    });
  }

  isMatched = false;
  showPassword = false;

  ngOnInit() {
    this.signupForm.valueChanges.subscribe(() => {
      this.isMatched =
        !!this.signupForm.get('username')?.valid &&
        !!this.signupForm.get('password')?.valid;
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.signupForm.valid) {
      this.auth.login(this.signupForm.value).subscribe({
        next: (res) => {
          if (res.status == true) {
            this.authTokenService.setToken(res.token);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['/home']);
            this.signupForm.reset();
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
      this.signupForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/index']);
  }
}
