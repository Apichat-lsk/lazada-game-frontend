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
import Swal from 'sweetalert2';

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
  hour = 20;
  minute = 0;

  ngOnInit(): void {
    Swal.fire({
      title: 'กำลังตรวจสอบข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.gameService.checkLastGameDate().subscribe({
      next: (res) => {
        if (res.game_date == null) {
          // const nextAvailableTime = dayjs()
          //   .tz('Asia/Bangkok')
          //   .hour(this.hour)
          //   .minute(this.minute)
          //   .second(0)
          //   .millisecond(0);

          // if (dayjs().isBefore(nextAvailableTime)) {
          //   this.zone.run(() => {
          this.checkGameToday = false;
          this.cd.detectChanges();
          //   });
          // } else {
          //   this.zone.run(() => {
          //     this.checkGameToday = true;
          //     this.cd.detectChanges();
          //   });
          // }
        } else {
          const nextAvailableTime = dayjs(res.game_date)
            .tz('Asia/Bangkok')
            // .add(1, 'day')
            .hour(this.hour)
            .minute(this.minute)
            .second(0)
            .millisecond(0);

          if (dayjs().isBefore(nextAvailableTime)) {
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
        Swal.close();
      },
      error: (err) => {
        console.error('❌ Game Start error:', err);
        Swal.close();
      },
    });
  }
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  Direct(path: string) {
    this.router.navigate([path]);
  }
}
