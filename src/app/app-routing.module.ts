import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigninGeneratorComponent } from './signin-generator/signin-generator.component';
import { SigninValidatorComponent } from './signin-validator/signin-validator.component';
import { FinishSigninComponent } from './finish-signin/finish-signin.component';
import { ConfirmAccessComponent } from './confirm-access/confirm-access.component';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signin-generator', component: SigninGeneratorComponent },
  { path: 'signin-validator', component: SigninValidatorComponent },
  { path: 'finish-signin', component: FinishSigninComponent },
  { path: 'edit-name', component: FinishSigninComponent },
  { path: 'confirm-access', component: ConfirmAccessComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '404', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
