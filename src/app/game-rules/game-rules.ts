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
  currentSlide = 0;

  slides = [
    {
      img: '/assets/images/rules/Exam.png',
      rules: '/assets/images/rules/Rule.png',
      title: 'เมื่อกดเริ่มเกม',
      caption:
        '1. ระบบจะนับถอยหลัง 5 วินาที จากนั้นผู้ใช้งานเลือกคำตอบที่ถูกต้อง',
    },
    {
      img: '/assets/images/rules/Exam2.png',
      rules: '/assets/images/rules/Rule2.png',
      title: 'แต่ละคำถาม 10 วินาที',
      caption: '2. ผู้ที่ตอบถูกและไวที่สุดจะได้คะแนนมาก',
    },
    {
      img: '/assets/images/rules/Exam3.png',
      rules: '/assets/images/rules/Rule3.png',
      title: 'ยิ่งตอบไวยิ่งได้คะแนนมาก',
      caption:
        '3. ตอบถูก 4 ข้อขึ้นไป ได้รับใบรับรอง ถ้าตอบถูกน้อยกว่า 4 ข้อ สามารถเล่นใหม่อีกครั้งในวันถัดไป',
    },
  ];

  constructor(private router: Router) {}

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

  acknowledge() {
    this.router.navigate(['/recaptcha']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
