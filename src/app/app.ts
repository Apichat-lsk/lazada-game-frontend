import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Signin } from './signin/signin';
import { Signup } from './signup/signup';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('lazada-game-fronend');
}
