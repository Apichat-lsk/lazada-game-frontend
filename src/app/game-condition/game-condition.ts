import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../services/otp-service';
import Swal from 'sweetalert2';
import { UserTransferService } from '../signup/user-transfer.service';

@Component({
  selector: 'app-game-condition',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './game-condition.html',
  styleUrl: './game-condition.css',
})
export class GameCondition {
  user: any;
  isChecked = false;
  scrolledToBottom = false;

  constructor(
    private otp: OtpService,
    private router: Router,
    private location: Location,
    private userTransferService: UserTransferService
  ) {
    this.location.replaceState('');
    this.user = this.userTransferService.userData;
    // this.userTransferService.userData = null;
  }
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.checkScrollPosition();
  }

  onScroll(event: Event): void {
    this.checkScrollPosition();
  }

  scrollToBottom(): void {
    const el = this.scrollContainer.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });

    setTimeout(() => {
      this.checkScrollPosition();
    }, 500);
  }

  checkScrollPosition(): void {
    const el = this.scrollContainer.nativeElement;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

    if (atBottom) {
      this.scrolledToBottom = true;
    }
  }
  Direct(path: string) {
    this.otp.send(this.user).subscribe({
      next: (res) => {
        if (res.check == true) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: res.message,
            showConfirmButton: false,
            timer: 1500,
          });
          this.router.navigate([path], {
            queryParams: { email: this.user.email, type: 'register' },
          });
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
  }

  goBack(): void {
    this.router.navigate(['/signup']);
  }

  onSubmit() {}
}
