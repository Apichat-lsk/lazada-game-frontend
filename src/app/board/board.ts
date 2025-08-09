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
  constructor(
    private router: Router,
    private location: Location,
    private authTokenService: AuthTokenService,
    private board: BoardService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.location.replaceState('');
  }
  @ViewChildren('myUserEl') userElements!: QueryList<ElementRef>;
  topUsers: any[] = [];
  filteredSortedUsers: any[] = [];
  myName = 'Apichat';
  currentPage = 1;
  itemsPerPage = 20;
  currentDate: Date = new Date();
  minDate = new Date(2025, 7, 2);
  maxDate = new Date(2025, 7, 10);
  scoreDate = new Date();
  firstUsername: string = '';
  secondUsername: string = '';
  thirdUsername: string = '';
  firstPoint: number = 0;
  secondPoint: number = 0;
  thirdPoint: number = 0;
  totalPages = 10;
  isLoading = false;

  async ngOnInit() {
    this.scoreDate.setHours(20, 30, 0, 0);
    await this.getAllBoard(this.currentDate);
    this.updateUsersByDate();
  }
  getAllBoard(date: Date): Promise<void> {
    return new Promise((resolve, reject) => {
      this.board.board({ date }).subscribe({
        next: (res) => {
          this.zone.run(() => {
            this.topUsers = res || [];
            this.updateUsersByDate(); // <-- ให้ Angular detect การเปลี่ยนแปลง
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

    if (new Date() >= this.scoreDate) {
      this.firstUsername = this.filteredSortedUsers[0]?.username || '';
      this.secondUsername = this.filteredSortedUsers[1]?.username || '';
      this.thirdUsername = this.filteredSortedUsers[2]?.username || '';
      this.firstPoint = this.filteredSortedUsers[0]?.score || 0;
      this.secondPoint = this.filteredSortedUsers[1]?.score || 0;
      this.thirdPoint = this.filteredSortedUsers[2]?.score || 0;
      this.cdr.detectChanges();
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      const myItem = document.getElementById('myUserItem');
      if (myItem) {
        myItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }
  // get totalPages(): number {
  //   return Math.ceil(this.topUsers.length / this.itemsPerPage);
  // }
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

  async nextDate() {
    this.isLoading = true;
    const next = new Date(this.currentDate);
    next.setDate(this.currentDate.getDate() + 1);
    this.scoreDate = new Date(next.setHours(20, 0, 0, 0));

    this.currentDate = next;
    await this.getAllBoard(this.currentDate);
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  async prevDate() {
    this.isLoading = true;
    const prev = new Date(this.currentDate);
    prev.setDate(this.currentDate.getDate() - 1);
    this.scoreDate = new Date(prev.setHours(20, 0, 0, 0));

    this.currentDate = prev;
    await this.getAllBoard(this.currentDate);
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  cancel(path: string) {
    this.router.navigate([path]);
  }
}
