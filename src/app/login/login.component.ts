import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { SharedHttpService } from '../shared/shared-http.service';
import { EmailAutocompleteDirective } from './email-autocomplete.directive';
import { LoadingComponent } from '../loading/loading.component';

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
  
  constructor(private router: Router, @Inject('API_URL') private apiUrl: string, private sharedService: SharedService, private sharedHttpService: SharedHttpService) {
    this.loading = new LoadingComponent();
  }

  email = '';
  terms = false;
  activeSuggestion: any = null;

  ngAfterViewInit() {
    this.focusAtEmail();
    this.hideLoading();
  }

  showLoading() {
    if(this.loading) {
      setTimeout(() => {
        this.loading.showLoading();
      });
    }
  }

  hideLoading() {
    if(this.loading) {
      setTimeout(() => {
        this.loading.hideLoading();
      });
    }
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

  onClearError() {
    if (this.terms && this.error) {
      this.error.nativeElement.innerText = '⠀';
    }
  }

  onEmailChange(newValue: string) {
    this.email = newValue;
    this.onClearError();
  }

  onSuggestionSelected(suggestion: string) {
    this.email = suggestion || '';
    this.onClearSuggestions();
    this.focusAtEmail();
  }

  onTermsChange() {
    this.onClearError();
    this.focusAtEmail();
  }

  onLabelTermsClick() {
    this.terms = !this.terms;
    this.onClearError();
    this.focusAtEmail();
  }

  onSuggestionClicked(suggestion: string) {
    if (this.emailAutocomplete) {
      this.emailAutocomplete.onSuggestionClicked(suggestion);
    }
  }

  login() {
    if (!this.terms && this.error) {
      this.error.nativeElement.innerText = 'Você precisa concordar com os termos';
      this.focusAtEmail();
    }
    else if (!this.sharedService.validateEmail(this.email) && this.error && this.inputEmail) {
      this.error.nativeElement.innerText = 'Insira um endereço de email válido';
      this.inputEmail.nativeElement.focus();
    }
    else {
      this.showLoading();
      const emailObject = { email: this.email };
      const jsonEmail = JSON.stringify(emailObject);

      this.sharedHttpService.makeLogin(`${this.apiUrl}/api/register-email`, jsonEmail)
        .subscribe(user => {
          this.onRedirect(user);
        });
    }
  }

  onRedirect(user: any) {
    this.hideLoading();
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
      if (this.error) {
        this.error.nativeElement.innerText = 'Não foi possivel validar o e-mail digitado';
      }
    }
  }
}