import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { GameService } from '../../services/game-service';
import { AuthTokenService } from '../../component/auth-token.service';
import { NgZone } from '@angular/core';

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
  currentDate: Date = new Date();
  fixedDate: Date = new Date(new Date().setHours(19, 59, 0, 0));

  ngOnInit(): void {
    if (this.currentDate.getTime() >= this.fixedDate.getTime()) {
      this.checkGameToday = true;
      this.cd.detectChanges();
    } else {
      this.gameService
        .checkGameDate({ userId: this.decodeToken.decodeToken()?.uid })
        .subscribe({
          next: (res) => {
            if (!res) {
              this.zone.run(() => {
                this.checkGameToday = false;
                this.cd.detectChanges();
              });
            }
          },
          error: (err) => {
            console.error('❌ Game Start error:', err);
          },
        });
    }
  }

  Direct(path: string) {
    this.router.navigate([path]);
  }
  gotoLazada() {
    window.open(
      'https://pages.lazada.co.th/wow/gcp/route/lazada/th/upr_1000345_lazada/channel/th/upr-router/th?hybrid=1&data_prefetch=true&prefetch_replace=1&at_iframe=1&wh_pid=/lazada/megascenario/th/99megabrandssale/lazjury',
      '_blank'
    );
  }
}
