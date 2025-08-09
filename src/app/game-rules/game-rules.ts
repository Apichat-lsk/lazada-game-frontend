import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../services/otp-service';
import { UserTransferService } from '../signup/user-transfer.service';
import { GameService } from '../../services/game-service';

@Component({
  selector: 'app-game-rules',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './game-rules.html',
  styleUrl: './game-rules.css',
})
export class GameRules {
  showSlides = true;
  currentSlide = 0;
  canAcknowledge = false;

  constructor(
    private otp: OtpService,
    private router: Router,
    private location: Location,
    private userTransferService: UserTransferService,
    private gameService: GameService
  ) {
    this.location.replaceState('');
  }
  slides = [
    {
      img: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'เมื่อกดเริ่มเกม',
      caption:
        '1. ระบบจะนับถอยหลัง 5 วินาที จากนั้นผู้ใช้งานเลือกคำตอบที่ถูกต้อง',
    },
    {
      img: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'แต่ละคำถาม 10 วินาที',
      caption: '2. ผู้ที่ตอบถูกและไวที่สุดจะได้คะแนนมาก',
    },
    {
      img: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600',
      title: 'ยิ่งตอบไวยิ่งได้คะแนนมาก',
      caption:
        '3. ตอบถูก 4 ข้อขึ้นไป ได้รับใบรับรอง ถ้าตอบถูกน้อยกว่า 4 ข้อ สามารถเล่นใหม่อีกครั้งในวันถัดไป',
    },
  ];

  ngOnInit(): void {}

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const isBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 20;

    this.canAcknowledge = isBottom;
  }

  acknowledge() {
    if (this.canAcknowledge) {
      this.router.navigate(['/recaptcha']);
    }
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
