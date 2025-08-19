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
import { ChangePassword } from './change-password/change-password';
import { Recapcha } from './recapcha/recapcha';
import { GameStart } from './game-start/game-start';
import { Board } from './board/board';
import { Thankyou } from './thankyou/thankyou';
import { Contact } from './contact/contact';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'signin', component: Signin },
  { path: 'otp', component: Otp },
  { path: 'index', component: Index },
  { path: 'contact', component: Contact },
  { path: 'condition', component: GameCondition },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'change-password', component: ChangePassword },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'rules', component: GameRules, canActivate: [AuthGuard] },
  { path: 'recaptcha', component: Recapcha, canActivate: [AuthGuard] },
  {
    path: 'game-start',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./game-start/game-start').then((m) => m.GameStart),
  },
  { path: 'board', component: Board, canActivate: [AuthGuard] },
  { path: 'thankyou', component: Thankyou, canActivate: [AuthGuard] },
  {
    path: '',
    redirectTo: '/index',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/index' },
];
