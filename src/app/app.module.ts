import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { EmailAutocompleteDirective } from './login/email-autocomplete.directive';
import { SigninGeneratorComponent } from './signin-generator/signin-generator.component';
import { SigninValidatorComponent } from './signin-validator/signin-validator.component';
import { FinishSigninComponent } from './finish-signin/finish-signin.component';
import { ConfirmAccessComponent } from './confirm-access/confirm-access.component';

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    LoginComponent,
    FooterComponent,
    EmailAutocompleteDirective,
    SigninGeneratorComponent,
    SigninValidatorComponent,
    FinishSigninComponent,
    ConfirmAccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
