import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { OtpService } from '../../services/otp-service';
import Swal from 'sweetalert2';
import { UserTransferService } from '../signup/user-transfer.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Otp implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  isMatched = false;
  isTime = false;
  private email: string = '';
  showEmail: string = '';
  private type: string = '';
  private pathUrl: string = '';
  user: any;
  totalSeconds = 300;
  displayMinutes = '50';
  displaySeconds = '00';

  constructor(
    private otp: OtpService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private route: ActivatedRoute,
    private userTransferService: UserTransferService
  ) {
    this.location.replaceState('');
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || '';
      this.showEmail = this.email.replace(/(.{2}).+(@.+)/, '$1***$2'); // แสดงแค่ 2 ตัวแรกและ @domain
      this.type = params.get('type') || '';
    });
    this.otpForm = new FormGroup({
      digit1: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      digit2: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      digit3: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      digit4: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      digit5: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
      digit6: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]$/),
      ]),
    });
  }

  // @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren(
    'otpInput0, otpInput1, otpInput2, otpInput3, otpInput4, otpInput5'
  )
  otpInputs!: QueryList<ElementRef>;

  private timerSubscription?: Subscription;

  ngOnInit() {
    this.totalSeconds = 300; // 5 minutes
    this.displayMinutes = '50';
    this.displaySeconds = '00';
    this.startTimer();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
    this.isTime = true;
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      nextInput?.nativeElement.focus();
    }
    this.isMatched = this.otpForm.valid;
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      prevInput?.nativeElement.focus();
    }
    setTimeout(() => {
      this.isMatched = this.otpForm.valid;
    });
  }
  startTimer() {
    this.isTime = false; // เริ่มต้นยังไม่สามารถขอ OTP ใหม่
    this.totalSeconds = 300; // 5 นาที
    this.displayMinutes = '50';
    this.displaySeconds = '00';
    this.timerSubscription?.unsubscribe();

    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;
        this.displayMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
        this.displaySeconds = seconds < 10 ? '0' + seconds : '' + seconds;
        this.cdr.markForCheck();
      } else {
        // ครบเวลาแล้วสามารถขอ OTP อีกครั้ง
        this.isTime = true;
        this.timerSubscription?.unsubscribe();
        this.cdr.markForCheck();
      }
    });
  }
  requestOtpAgain() {
    this.totalSeconds = 300; // 5 minutes
    this.displayMinutes = '50';
    this.displaySeconds = '00';
    Swal.fire({
      title: 'กำลังตรวจสอบข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.otp.getOtp({ email: this.email }).subscribe({
      next: (res) => {
        if (res.check == true) {
          this.isTime = false;
        } else {
          console.error('❌ Game Conditon error:', res.message);
        }
        Swal.close();
      },
      error: (err) => {
        console.error('❌ Game Conditon error:', err);
        Swal.close();
      },
    });
    this.startTimer();
  }
  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pasteData = event.clipboardData?.getData('text') || '';
    const digits = pasteData.replace(/\D/g, '').slice(0, 6); // เอาแค่ตัวเลข 6 ตัว

    if (digits.length === 0) return;

    const controls = [
      'digit1',
      'digit2',
      'digit3',
      'digit4',
      'digit5',
      'digit6',
    ];

    digits.split('').forEach((digit, i) => {
      const control = this.otpForm.get(controls[i]);
      if (control instanceof FormControl) {
        control.setValue(digit);
      }
    });

    const inputs = this.otpInputs.toArray();
    const nextIndex =
      digits.length < inputs.length ? digits.length : inputs.length - 1;
    inputs[nextIndex]?.nativeElement.focus();
    this.isMatched = this.otpForm.valid;
  }

  get digits() {
    return [
      this.otpForm.get('digit1'),
      this.otpForm.get('digit2'),
      this.otpForm.get('digit3'),
      this.otpForm.get('digit4'),
      this.otpForm.get('digit5'),
      this.otpForm.get('digit6'),
    ];
  }

  get isOtpTouchedAndInvalid() {
    return this.otpForm.invalid && this.digits.some((d) => d?.touched);
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otpCode = Object.values(this.otpForm.value).join('');
      const request = {
        email: this.email,
        otp: otpCode,
      };
      if (this.type == 'register') {
        Swal.fire({
          title: 'กำลังตรวจสอบข้อมูล...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.otp.verify(request).subscribe({
          next: (res) => {
            if (res.status == true) {
              Swal.close();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: res.message,
                showConfirmButton: false,
                timer: 1500,
              });
              this.router.navigate(['/signin']);
            } else {
              console.error('❌ OTP error:', res.message);
              Swal.close();
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
            console.error('❌ OTP error:', err);
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
        Swal.fire({
          title: 'กำลังตรวจสอบข้อมูล...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.otp.forgotPasswordVerifyOtp(request).subscribe({
          next: (res) => {
            if (res.status == true) {
              Swal.close();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: res.message,
                showConfirmButton: false,
                timer: 1500,
              });
              this.router.navigate(['/change-password'], {
                queryParams: { email: this.email },
              });
            } else {
              console.error('❌ OTP error:', res.message);
              Swal.close();
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
            console.error('❌ OTP error:', err);
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
      }
    } else {
      this.otpForm.markAllAsTouched();
    }
  }
  goBack(): void {
    if (this.type == 'register') {
      this.pathUrl = '/condition';
    } else {
      this.pathUrl = '/forgot-password';
    }
    this.router.navigate([this.pathUrl]);
  }
}
