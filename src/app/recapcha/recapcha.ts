import {
  Component,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecaptchaService } from '../../services/recaptcha-service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthTokenService } from '../../component/auth-token.service';

@Component({
  selector: 'app-recapcha',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recapcha.html',
  styleUrl: './recapcha.css',
})
export class Recapcha implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private captcha: RecaptchaService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {
    this.location.replaceState('');
  }
  isMatched = false;
  widgetId: number | undefined;

  ngAfterViewInit() {
    const interval = setInterval(() => {
      if (typeof window.grecaptcha?.render === 'function') {
        clearInterval(interval);
        this.renderRecaptcha();
      } else {
        //console.log('⌛ รอโหลด reCAPTCHA...');
      }
    }, 300);
  }

  ngOnDestroy() {
    if (window.grecaptcha && this.widgetId !== undefined) {
      window.grecaptcha.reset(this.widgetId);
    }
  }

  renderRecaptcha() {
    const container = document.getElementById('recaptcha-container');
    if (container && window.grecaptcha) {
      //console.log('🛠 เรียก renderRecaptcha()');

      this.widgetId = window.grecaptcha.render(container, {
        sitekey: '6LeSJ5orAAAAAPQU8Gej56AQ-K4daO1Bkvg8vs2-',
        callback: (response: string) => {
          //console.log('📦 callback ถูกเรียกจาก reCAPTCHA', response);
          this.verifyCallback(response);
        },
      });

      //console.log('✅ reCAPTCHA rendered.');
    } else {
      console.error('❌ ไม่พบ container หรือ grecaptcha ยังไม่โหลด');
    }
  }
  verifyCallback(response: string) {
    setTimeout(() => {
      this.zone.run(() => {
        this.isMatched = !!response;
        this.cdr.detectChanges();
      });
    }, 0);
  }
  onSubmit() {
    if (!window.grecaptcha || this.widgetId === undefined) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'reCAPTCHA ยังไม่โหลด กรุณารอสักครู่',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    const token = window.grecaptcha.getResponse(this.widgetId);
    if (!token) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'กรุณายืนยัน reCAPTCHA',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    Swal.fire({
      title: 'กำลังตรวจสอบข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.captcha.recaptcha({ token }).subscribe({
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
          this.router.navigate(['/game-start']);
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
}
