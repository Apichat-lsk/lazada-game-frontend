import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-game-condition',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './game-condition.html',
  styleUrl: './game-condition.css',
})
export class GameCondition {
  constructor(private router: Router, private location: Location) {
    this.location.replaceState('');
  }

  isChecked = false;

  Direct(path: string) {
    this.router.navigate([path]);
  }
}
