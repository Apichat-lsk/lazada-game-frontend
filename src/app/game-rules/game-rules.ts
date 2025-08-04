import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { OtpService } from '../../services/otp-service';
import { UserTransferService } from '../signup/user-transfer.service';

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

  constructor(
    private otp: OtpService,
    private router: Router,
    private location: Location,
    private userTransferService: UserTransferService
  ) {
    this.location.replaceState('');
  }
  slides = [
    {
      img: 'https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=600',
      caption: '1. อ่านเงื่อนไขและกดเริ่มเล่นเกมส์',
    },
    {
      img: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=600',
      caption: '2. ตอบคำถามให้ถูกอย่างน้อย 4 ข้อจากทั้งหมด 5 ข้อ',
    },
    {
      img: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600',
      caption: '3. ถ้าสอบผ่านจะได้รับใบประกาศนียบัตร',
    },
  ];

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

  // Direct(path: string) {
  //   this.router.navigate([path]);
  // }

  acknowledge() {
    this.router.navigate(['/signin']);
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
