import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthTokenService } from '../../component/auth-token.service';
import { BoardService } from '../../services/board-service';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  userData: any = null;
  myName: string = '';
  constructor(
    private router: Router,
    private location: Location,
    private authTokenService: AuthTokenService,
    private auth: AuthTokenService,
    private board: BoardService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.location.replaceState('');
    this.userData = this.authTokenService.decodeToken();
    this.myName = this.userData.username || '';
  }
  @ViewChildren('myUserEl') userElements!: QueryList<ElementRef>;
  topUsers: any[] = [];
  filteredSortedUsers: any[] = [];
  myScore = 0;
  myRank = 0;
  currentPage = 1;
  itemsPerPage = 20;
  currentDate: Date = new Date();
  minDate = new Date(2025, 7, 20); // มกราเริ่มจาก 0
  maxDate = new Date();
  scoreDate = new Date();
  totalPages = 10;
  isLoading = false;

  async ngOnInit() {
    this.scoreDate.setHours(20, 30, 0, 0);
    if (this.currentDate >= this.scoreDate) {
      await this.getAllBoard(this.currentDate);
      this.updateUsersByDate();
    }
  }
  async getAllBoard(date: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      const now = new Date().getDate();
      const currentDay = this.currentDate.getDate();
      if (now == currentDay) {
        if (this.currentDate < this.scoreDate) {
          this.isLoading = false;
          return;
        }
      }
      this.board.board({ date }).subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.topUsers = res || [];

            this.updateUsersByDate();
          });
          resolve();
        },
        error: (err) => {
          console.error('❌ Game Start error:', err);
          reject();
        },
      });
    });
  }
  updateUsersByDate() {
    this.filteredSortedUsers = this.topUsers
      // .filter((user) => this.isSameDate(user.date, this.currentDate))
      .sort((a, b) => b.score - a.score);

    // if (new Date() > this.scoreDate) {
    const myData = this.filteredSortedUsers.find(
      (user) => user.username === this.myName
    );
    if (myData) {
      this.myScore = myData.score;
      this.myRank =
        this.filteredSortedUsers.findIndex(
          (user) => user.username === this.myName
        ) + 1;
    }
    this.cdr.detectChanges();
    // }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const myItem = document.getElementById('myUserItem');
      if (myItem) {
        myItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  pagedUsers() {
    return this.filteredSortedUsers;
  }

  isSameDate(d1: Date, d2: Date): boolean {
    if (!d1 || !d2) return false;

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  canGoNext(): boolean {
    const now = new Date().getDate();
    const currentDay = this.currentDate.getDate();
    if (now == currentDay) {
      return true;
    }
    return false;
  }
  async nextDate() {
    this.isLoading = true;
    const next = new Date(this.currentDate);
    next.setDate(this.currentDate.getDate() + 1);
    // this.scoreDate = new Date(next.setUTCHours(20, 0, 0, 0));
    this.currentDate = next;
    await this.getAllBoard(next);
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  canShowScore(): boolean {
    const now = new Date().getDate();
    const currentDay = this.currentDate.getDate();
    if (now == currentDay) {
      if (this.currentDate > this.scoreDate) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  canShowTime(): boolean {
    const now = new Date().getDate();
    const currentDay = this.currentDate.getDate();
    if (now == currentDay) {
      if (this.currentDate > this.scoreDate) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  get isLeftDisabled() {
    return this.currentDate <= this.minDate || this.isLoading;
  }

  get isRightDisabled() {
    return this.currentDate >= this.maxDate || this.isLoading;
  }
  async prevDate() {
    this.isLoading = true;
    const prev = new Date(this.currentDate);
    prev.setDate(this.currentDate.getDate() - 1);
    // this.scoreDate = new Date(prev.setUTCHours(20, 0, 0, 0));
    this.currentDate = prev;
    await this.getAllBoard(prev);
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  cancel(path: string) {
    this.router.navigate([path]);
  }
  gotoLazada() {
    window.open(
      'https://pages.lazada.co.th/wow/gcp/route/lazada/th/upr_1000345_lazada/channel/th/upr-router/th?hybrid=1&data_prefetch=true&prefetch_replace=1&at_iframe=1&wh_pid=/lazada/megascenario/th/99megabrandssale/lazjury',
      '_blank'
    );
  }
}
