import { Routes } from '@angular/router';
import { Signup } from './signup/signup';
import { Otp } from './otp/otp';
import { Signin } from './signin/signin';
import { Index } from './index';
import { Home } from './home/home';
import { GameCondition } from './game-condition/game-condition';
import { GameRules } from './game-rules/game-rules';
import { AuthGuard } from '../component/auth-expired-token';
import { ForgotPassword } from './forgot-password/forgot-password';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'signin', component: Signin },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'otp', component: Otp },
  { path: 'index', component: Index },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'condition', component: GameCondition, canActivate: [AuthGuard] },
  { path: 'rules', component: GameRules, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: '/index',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/index' },
];
