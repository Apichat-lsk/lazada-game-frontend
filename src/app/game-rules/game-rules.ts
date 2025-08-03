import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-game-rules',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './game-rules.html',
  styleUrl: './game-rules.css',
})
export class GameRules {
  constructor(private router: Router, private location: Location) {
    this.location.replaceState('');
  }

  isChecked = false;

  Direct(path: string) {
    this.router.navigate([path]);
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
}
