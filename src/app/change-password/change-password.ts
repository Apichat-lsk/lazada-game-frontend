import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service';
import { CommonModule, Location } from '@angular/common';
import { AuthTokenService } from '../../component/auth-token.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword implements OnInit {
  private email: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private authTokenService: AuthTokenService
  ) {
    this.location.replaceState('');
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || '';
    });
  }

  isMatched: boolean = false;

  changePasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z0-9\s!@#$%^&*]{6,}$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z0-9\s!@#$%^&*]{6,}$/),
      ]),
    },
    { validators: this.passwordsMatchValidator }
  );

  ngOnInit(): void {
    this.changePasswordForm.valueChanges.subscribe(() => {
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword =
        this.changePasswordForm.get('confirmPassword')?.value;
      this.isMatched =
        !!newPassword && !!confirmPassword && newPassword === confirmPassword;
    });
  }

  passwordsMatchValidator(
    group: AbstractControl
  ): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  isPasswordMatch(): boolean {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmPassword =
      this.changePasswordForm.get('confirmPassword')?.value;
    return (
      !!newPassword && !!confirmPassword && newPassword === confirmPassword
    );
  }
  onSubmit() {
    if (this.changePasswordForm.valid) {
      const request = {
        email: this.email,
        password: this.changePasswordForm.value.newPassword,
      };
      this.auth.changePassword(request).subscribe({
        next: (res) => {
          if (res.status == true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigate(['/login']);
            this.changePasswordForm.reset();
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
      this.changePasswordForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/forgot-password']);
  }
}
