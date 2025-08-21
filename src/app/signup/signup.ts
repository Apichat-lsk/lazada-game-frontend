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
        Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z\s]+$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[ก-๏A-Za-z0-9\s!@#$%^&*]{6,}$/),
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
      // Swal.fire({
      //   title: 'ยืนยันการสมัคร?',
      //   text: 'ระบบไม่สามารถกลับไปแก้ไขข้อมูลได้ กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดปุ่ม “ตกลง”',
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonText: 'ตกลง',
      //   cancelButtonText: 'ยกเลิก',
      //   customClass: {
      //     popup: 'p-6', // กรณีอยากปรับ padding เพิ่ม
      //     actions: 'flex justify-center gap-4', // container ปุ่ม: แสดงเป็น flex แนวนอน ห่างกัน 1rem
      //     confirmButton: `
      //   bg-[rgba(255,0,102,1)] w-36 h-[50px] text-white font-bold text-2xl rounded-full
      //   shadow-[0_4px_0_0_rgba(0,0,0,0.4),_inset_0_-4px_0_0_rgba(0,0,0,0.4)]
      //   active:shadow-[0_0px_0_0_rgba(0,0,0,0.4),_inset_0_4px_0_0_rgba(0,0,0,0.4)]
      //   transition duration-150 hover:brightness-110 cursor-pointer
      // `
      //       .replace(/\s+/g, ' ')
      //       .trim(),
      //     cancelButton: `
      //   bg-gray-400 w-36 h-[50px] text-white font-bold text-2xl rounded-full
      //   transition duration-150 hover:bg-gray-500 cursor-pointer
      // `
      //       .replace(/\s+/g, ' ')
      //       .trim(),
      //   },
      //   buttonsStyling: false,
      // }).then((result) => {
      //   if (result.isConfirmed) {
      this.auth.checkDuplicate(this.signupForm.value).subscribe({
        next: (res) => {
          if (res.check == true) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: res.message,
              showConfirmButton: false,
              timer: 1500,
            });
            this.userTransferService.userData = this.signupForm.value;
            this.router.navigate(['/condition']);
            this.signupForm.reset();
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
      // }
      // });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/index']);
  }
}
