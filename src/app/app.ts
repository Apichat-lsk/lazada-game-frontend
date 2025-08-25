import { Component, signal, HostListener } from '@angular/core';
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
  // @HostListener('document:contextmenu', ['$event'])
  // onRightClick(event: MouseEvent) {
  //   event.preventDefault();
  // }

  // @HostListener('document:keydown', ['$event'])
  // onKeyDown(event: KeyboardEvent) {
  //   if (event.key === 'F12') {
  //     event.preventDefault();
  //   }

  //   if (
  //     (event.ctrlKey && event.shiftKey && event.key === 'I') ||
  //     (event.ctrlKey && event.key === 'U') ||
  //     (event.ctrlKey && event.key === 'S')
  //   ) {
  //     event.preventDefault();
  //   }
  // }
  protected readonly title = signal('lazada-game-fronend');
}
