import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../services/otp-service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { UserTransferService } from './user-transfer.service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm!: FormGroup;
  isMatched = false;
  showPassword = false;
  registerFlak = false;

  constructor(
    private otp: OtpService,
    private auth: AuthService,
    private router: Router,
    private location: Location,
    private userTransferService: UserTransferService,
    private fb: FormBuilder
  ) {
    this.location.replaceState('');
    this.signupForm = this.fb.group({
      fullName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^\s]+$/),
      ]),
      address: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z0-9!@#$%^&*]{6,}$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      tel: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(0|(\+66))[0-9]{8,9}$/),
      ]),
    });
  }

  ngOnInit() {
    this.signupForm.valueChanges.subscribe(() => {
      this.isMatched =
        !!this.signupForm.get('username')?.valid &&
        !!this.signupForm.get('password')?.valid &&
        !!this.signupForm.get('email')?.valid &&
        !!this.signupForm.get('tel')?.valid &&
        !!this.signupForm.get('address')?.valid &&
        !!this.signupForm.get('fullName')?.valid;
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onCancel() {
    this.registerFlak = false;
  }
  onConfirm() {
    if (this.signupForm.valid) {
      this.registerFlak = true;
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      Swal.fire({
        title: 'กำลังตรวจสอบข้อมูล...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      this.auth.checkDuplicate(this.signupForm.value).subscribe({
        next: (res) => {
          Swal.close();
          if (res.check == true) {
            this.userTransferService.userData = this.signupForm.value;
            this.router.navigate(['/condition']);
            this.signupForm.reset();
          } else {
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
          Swal.close();
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
