import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { EmailAutocompleteDirective } from './email-autocomplete.directive';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild(EmailAutocompleteDirective, { static: false }) emailAutocomplete?: EmailAutocompleteDirective;
  @ViewChild('inputEmail', { static: false }) inputEmail?: ElementRef;
  @ViewChild('error', { static: false }) error?: ElementRef;
  @ViewChild(LoadingComponent) loading: LoadingComponent;

  constructor(private router: Router, private sharedService: SharedService, private http: HttpClient) {
    this.loading = new LoadingComponent();
  }

  email = '';
  terms = false;
  activeSuggestion: any = null;

  ngOnInit() {
    const storage = window.localStorage;
    const session = storage.getItem('session') || '';
    const isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';

    if (session.length == 100 && isSessionTokenActive == 'true') {
      this.router.navigate(['profile']);
    }
  }

  ngAfterViewInit() {
    this.focusAtEmail();
    this.sharedService.onHideLoading(this.loading);
  }

  focusAtEmail() {
    if (this.inputEmail) {
      this.inputEmail.nativeElement.focus();
    }
  }

  onClearSuggestions() {
    if (this.emailAutocomplete) {
      this.emailAutocomplete.clearSuggestions();
    }
  }

  onEmailChange(newValue: string) {
    this.email = newValue;
    this.sharedService.onClearError(this.error);
  }

  onSuggestionSelected(suggestion: string) {
    this.email = suggestion || '';
    this.onClearSuggestions();
    this.focusAtEmail();
  }

  onTermsChange() {
    this.sharedService.onClearError(this.error);
    this.focusAtEmail();
  }

  onLabelTermsClick() {
    this.terms = !this.terms;
    this.sharedService.onClearError(this.error);
    this.focusAtEmail();
  }

  onSuggestionClicked(suggestion: string) {
    if (this.emailAutocomplete) {
      this.emailAutocomplete.onSuggestionClicked(suggestion);
    }
  }

  login() {
    if (!this.terms) {
      this.sharedService.onShowError(this.error, 'Você precisa concordar com os termos');
      this.focusAtEmail();
    }
    else if (!this.sharedService.onValidateEmail(this.email)) {
      this.sharedService.onShowError(this.error, 'Insira um endereço de email válido');
      this.focusAtEmail();
    }
    else {
      this.sharedService.onShowLoading(this.loading);

      const json = { email: this.email };
      const { apiUrl, registerEmail, httpOptions } = environment;

      this.http.post<User>(`${apiUrl}${registerEmail}`, json, httpOptions)
        .pipe(
          catchError((error) => {
            this.sharedService.onHideLoading(this.loading);
            this.sharedService.onShowError(this.error, 'Não foi possivel validar o e-mail digitado');
            return throwError(error);
          })
        )
        .subscribe((user) => {
          this.onRedirect(user)
        });
    }
  }

  onRedirect(user: any) {
    this.sharedService.onHideLoading(this.loading);
    if (user.userId >= 1) {
      const storage = window.localStorage;
      storage.setItem('email', this.email);
      storage.setItem('isLogin', user.isLogin.toString());
      storage.setItem('session', user.session);
      storage.setItem('isSessionTokenActive', user.isSessionTokenActive.toString());

      if (user.isLogin === false) {
        storage.setItem('signin-validator-type', 'otp');
        this.router.navigate(['signin-validator']);
      }
      else if (user.isLogin === true) {
        this.router.navigate(['signin-generator']);
      }
    }
    else {
      this.sharedService.onShowError(this.error, 'Não foi possivel validar o e-mail digitado');
    }
  }
}