import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthTokenService } from '../../component/auth-token.service';
import { BoardService } from '../../services/board-service';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Swal from 'sweetalert2';

dayjs.extend(utc);
dayjs.extend(timezone);

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
  currentDate = dayjs().tz('Asia/Bangkok').toDate();
  toDay = dayjs().tz('Asia/Bangkok');
  minDate = dayjs()
    .tz('Asia/Bangkok')
    .date(20)
    .month(8)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);
  maxDate = new Date();
  scoreDate = dayjs()
    .tz('Asia/Bangkok')
    .hour(20)
    .minute(0)
    .second(0)
    .millisecond(0);
  boardDate = dayjs()
    .tz('Asia/Bangkok')
    .hour(20)
    .minute(0)
    .second(0)
    .millisecond(0);

  totalPages = 10;
  isLoading = false;
  houre = 20;
  dateSerchBoard = dayjs()
    .tz('Asia/Bangkok')
    .hour(20)
    .minute(0)
    .second(0)
    .millisecond(0);

  async ngOnInit() {
    console.log(this.minDate.toDate());

    if (dayjs().isAfter(this.dateSerchBoard.toDate())) {
      await this.getAllBoard(this.currentDate);
      this.updateUsersByDate();
    }
  }
  async getAllBoard(date: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: 'กำลังตรวจสอบข้อมูล...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.board.board({ date }).subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.topUsers = res || [];

            this.updateUsersByDate();
          });
          Swal.close();
          resolve();
        },
        error: (err) => {
          console.error('❌ Game Start error:', err);
          Swal.close();
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
    } else {
      this.myScore = 0;
      this.myRank = 0;
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
  async prevDate() {
    this.isLoading = true;
    const date = dayjs(this.currentDate).tz('Asia/Bangkok').subtract(1, 'day');
    // .hour(0)
    // .minute(0)
    // .second(0)
    // .millisecond(0);
    this.currentDate = date.toDate();
    await this.getAllBoard(date.toDate());
    this.isLoading = false;
    this.cdr.detectChanges();
  }
  async nextDate() {
    this.isLoading = true;
    const date = dayjs(this.currentDate).tz('Asia/Bangkok').add(1, 'day');
    // .hour(0)
    // .minute(0)
    // .second(0)
    // .millisecond(0);
    this.currentDate = date.toDate();
    await this.getAllBoard(date.toDate());
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  canShowScore(): boolean {
    const now = dayjs().date();
    const currentDay = dayjs(this.currentDate).date();
    if (now == currentDay) {
      if (this.currentDate > this.scoreDate.toDate()) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  canShowTime(): boolean {
    const now = dayjs().date();
    const currentDay = dayjs(this.currentDate).date();
    if (now == currentDay) {
      if (this.currentDate > this.scoreDate.toDate()) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  get isLeftDisabled() {
    const now = dayjs(this.currentDate).date();
    const toDay = dayjs(this.minDate).date();
    if (now == toDay) {
      return true;
    } else {
      return false;
    }
  }

  get isRightDisabled() {
    const now = dayjs().date();
    const toDay = dayjs(this.currentDate).date();
    if (now == toDay) {
      return true;
    } else {
      return false;
    }
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
