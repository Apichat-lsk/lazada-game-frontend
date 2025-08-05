import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthTokenService } from '../../component/auth-token.service';

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
    private authTokenService: AuthTokenService
  ) {
    this.location.replaceState('');
  }
  @ViewChildren('myUserEl') userElements!: QueryList<ElementRef>;
  topUsers = [
    { username: 'สมชาย', score: 1200, date: new Date('2025-08-01') },
    { username: 'สมชาย', score: 1000, date: new Date('2025-08-02') },
    { username: 'สมชาย', score: 1150, date: new Date('2025-08-03') },
    { username: 'สมชาย', score: 1150, date: new Date('2025-08-04') },
    { username: 'สมชาย', score: 1000, date: new Date('2025-08-05') },
    { username: 'สมหมาย', score: 500, date: new Date('2025-08-01') },
    { username: 'สมหมาย', score: 1001, date: new Date('2025-08-02') },
    { username: 'สมหมาย', score: 1150, date: new Date('2025-08-03') },
    { username: 'สมหมาย', score: 1150, date: new Date('2025-08-04') },
    { username: 'สมหมาย', score: 900, date: new Date('2025-08-05') },
    { username: 'Apichat', score: 300, date: new Date('2025-08-01') },
    { username: 'Apichat', score: 1200, date: new Date('2025-08-02') },
    { username: 'Apichat', score: 1150, date: new Date('2025-08-03') },
    { username: 'Apichat', score: 1150, date: new Date('2025-08-04') },
    { username: 'Apichat', score: 700, date: new Date('2025-08-05') },
    { username: 'Jhon', score: 1150, date: new Date('2025-08-01') },
    { username: 'Jhon', score: 1150, date: new Date('2025-08-02') },
    { username: 'Jhon', score: 1150, date: new Date('2025-08-03') },
    { username: 'Jhon', score: 1150, date: new Date('2025-08-04') },
    { username: 'Jhon', score: 400, date: new Date('2025-08-05') },
  ];
  filteredSortedUsers: any[] = [];
  myName = 'Apichat';
  currentPage = 1;
  itemsPerPage = 20;
  currentDate: Date = new Date();
  minDate = new Date(2025, 7, 1);
  maxDate = new Date(2025, 7, 10);
  scoreDate = new Date('2025-08-05 13:00');
  firstUsername: string = '';
  secondUsername: string = '';
  thirdUsername: string = '';
  firstPoint: number = 0;
  secondPoint: number = 0;
  thirdPoint: number = 0;
  totalPages = 5;
  ngOnInit() {
    console.log(this.scoreDate);

    this.updateUsersByDate();
  }

  updateUsersByDate() {
    this.filteredSortedUsers = this.topUsers
      .filter((user) => this.isSameDate(user.date, this.currentDate))
      .sort((a, b) => b.score - a.score);

    this.firstUsername = this.filteredSortedUsers[0]?.username || '';
    this.secondUsername = this.filteredSortedUsers[1]?.username || '';
    this.thirdUsername = this.filteredSortedUsers[2]?.username || '';
    this.firstPoint = this.filteredSortedUsers[0]?.score || 0;
    this.secondPoint = this.filteredSortedUsers[1]?.score || 0;
    this.thirdPoint = this.filteredSortedUsers[2]?.score || 0;
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
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
  // pagedUsers() {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   return this.topUsers.slice(start, end);
  // }
  nextDate() {
    const next = new Date(this.currentDate);
    next.setDate(this.currentDate.getDate() + 1);
    if (next <= this.maxDate) {
      this.currentDate = next;
      this.updateUsersByDate();
    }
  }

  prevDate() {
    const prev = new Date(this.currentDate);
    prev.setDate(this.currentDate.getDate() - 1);
    if (prev >= this.minDate) {
      this.currentDate = prev;
      this.updateUsersByDate();
    }
  }
  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //   }
  // }

  // prevPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //   }
  // }
  cancel(path: string) {
    this.router.navigate([path]);
  }
}
