import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { GameService } from '../../services/game-service';
import { AuthTokenService } from '../../component/auth-token.service';
import { NgZone } from '@angular/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    private gameService: GameService,
    private decodeToken: AuthTokenService,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.location.replaceState('');
  }

  checkGameToday = true;

  ngOnInit(): void {
    this.gameService.checkLastGameDate().subscribe({
      next: (res) => {
        if (res.game_date == null) {
          const nextDateQuestion = dayjs()
            .tz('Asia/Bangkok') // เวลาไทย
            // .add(1, 'day') // +1 วัน
            .hour(20) // ตั้งชั่วโมงเป็น 20
            .minute(0) // ตั้งนาทีเป็น 0
            .second(0) // ตั้งวินาทีเป็น 0
            .millisecond(0); // ตั้งมิลลิวินาทีเป็น 0
          if (new Date() < nextDateQuestion.toDate()) {
            this.zone.run(() => {
              this.checkGameToday = true;
              this.cd.detectChanges();
            });
          } else {
            this.zone.run(() => {
              this.checkGameToday = false;
              this.cd.detectChanges();
            });
          }
        } else {
          const nextDateQuestion = dayjs(res.game_date)
            .tz('Asia/Bangkok') // เวลาไทย
            // .add(1, 'day') // +1 วัน
            .hour(20) // ตั้งชั่วโมงเป็น 20
            .minute(0) // ตั้งนาทีเป็น 0
            .second(0) // ตั้งวินาทีเป็น 0
            .millisecond(0); // ตั้งมิลลิวินาทีเป็น 0

          console.log(new Date(nextDateQuestion.format()));
          if (new Date() < nextDateQuestion.toDate()) {
            this.zone.run(() => {
              this.checkGameToday = true;
              this.cd.detectChanges();
            });
          } else {
            this.zone.run(() => {
              this.checkGameToday = false;
              this.cd.detectChanges();
            });
          }
        }
      },
      error: (err) => {
        console.error('❌ Game Start error:', err);
      },
    });
  }

  Direct(path: string) {
    this.router.navigate([path]);
  }
}
