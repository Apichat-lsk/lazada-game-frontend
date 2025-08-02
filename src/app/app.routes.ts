import { Routes } from '@angular/router';
import { Signup } from './signup/signup';
import { Otp } from './otp/otp';
import { Signin } from './signin/signin';
import { Index } from './index';
import { Home } from './home/home';
import { GameCondition } from './game-condition/game-condition';
import { GameRules } from './game-rules/game-rules';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'signin', component: Signin },
  { path: 'otp/:email', component: Otp },
  { path: 'index', component: Index },
  { path: 'home', component: Home },
  { path: 'condition', component: GameCondition },
  { path: 'rules', component: GameRules },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: '**', redirectTo: '/index' },
];
