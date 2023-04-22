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

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    LoginComponent,
    FooterComponent,
    EmailAutocompleteDirective,
    SigninGeneratorComponent
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
