import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { EmailAutocompleteDirective } from './email-autocomplete.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild(EmailAutocompleteDirective, { static: false }) emailAutocomplete?: EmailAutocompleteDirective;
  @ViewChild('inputEmail', { static: false }) inputEmail?: ElementRef;
  @ViewChild('error', { static: false }) error?: ElementRef;

  email: string = '';
  terms: boolean = false;
  activeSuggestion: any = null;

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.focusAtEmail();
  }

  focusAtEmail() {
    if (this.inputEmail) {
      this.inputEmail.nativeElement.focus();
    }
  }

  onClearSuggestions() {
    this.emailAutocomplete?.clearSuggestions();
  }

  onClearError() {
    if (this.terms && this.error) {
      this.error.nativeElement.innerText = '⠀';
    }
  }

  constructor(private router: Router) { }

  onEmailChange(newValue: string) {
    this.email = newValue;
    this.onClearError();
  }

  onSuggestionSelected(suggestion: string) {
    this.email = `${suggestion ? suggestion : ''}`;
    this.onClearSuggestions();
    this.focusAtEmail();
  }

  onTermsChange(event: any) {
    this.onClearError();
    this.focusAtEmail();
  }

  onLabelTermsClick() {
    if (this.terms) {
      this.terms = false;
      this.focusAtEmail();
      this.onClearError();
    }
    else {
      this.terms = true;
      this.focusAtEmail();
      this.onClearError();
    }
  }

  onSuggestionClicked(suggestion: string) {
    this.emailAutocomplete?.onSuggestionClicked(suggestion);
  }

  login() {
    if (this.terms == false && this.error) {
      this.error.nativeElement.innerText = 'Você precisa concordar com os termos.';
      this.focusAtEmail();
    }
    else if (!this.validateEmail(this.email) && this.error && this.inputEmail) {
      this.error.nativeElement.innerText = 'Insira um endereço de email válido.';
      this.inputEmail.nativeElement?.focus();
    } else {
      const [username, domain] = this.email.split('@');

      this.router.navigate(['/signin-generator'], { queryParams: { username: username, domain: domain } });
    }
  }

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}