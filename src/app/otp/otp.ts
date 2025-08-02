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
import { OtpService } from '../../util/otp-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Otp implements OnInit, OnDestroy {
  private email: string = '';

  constructor(
    private otp: OtpService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.location.replaceState('');
    this.route.paramMap.subscribe((params) => {
      this.email = params.get('email') || '';
    });
  }

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  private timerSubscription?: Subscription;

  // Method สำหรับเลื่อน focus
  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < this.otpInputs.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
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

    // focus ช่องถัดไปหรือสุดท้าย
    const inputs = this.otpInputs.toArray();
    const nextIndex =
      digits.length < inputs.length ? digits.length : inputs.length - 1;
    inputs[nextIndex]?.nativeElement.focus();
  }
  otpForm = new FormGroup({
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

  // นับเวลาถอยหลัง 5 นาที = 300 วินาที
  totalSeconds = 300;
  displayMinutes = '05';
  displaySeconds = '00';

  ngOnInit() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.totalSeconds > 0) {
        this.totalSeconds--;
        const minutes = Math.floor(this.totalSeconds / 60);
        const seconds = this.totalSeconds % 60;
        this.displayMinutes = minutes < 10 ? '0' + minutes : '' + minutes;
        this.displaySeconds = seconds < 10 ? '0' + seconds : '' + seconds;

        this.cdr.detectChanges(); // <-- ตรงนี้
      } else {
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  onSubmit() {
    if (this.otpForm.valid) {
      const otpCode = Object.values(this.otpForm.value).join('');
      const request = {
        email: this.email,
        otp: otpCode,
      };
      this.otp.verify(request).subscribe({
        next: (res) => {
          if (res.status == true) {
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
      this.otpForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.router.navigate(['/signup']);
  }
}
