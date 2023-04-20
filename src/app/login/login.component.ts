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
    if (this.inputEmail) {
      this.inputEmail.nativeElement.focus();
    }
  }

  onClearSuggestions() {
    this.emailAutocomplete?.clearSuggestions();
  }

  onClearError() {
    if (this.terms == true && this.error) {
      this.error.nativeElement.innerText = '';
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
    if (this.inputEmail) {
      this.inputEmail.nativeElement.focus();
    }
  }

  onTermsChange(event: any) {
    this.onClearError();
  }

  onLabelTermsClick() {
    if(this.terms) {
      this.terms = false;
    }
    else {
      this.terms = true;
    }
  }

  onSuggestionClicked(suggestion: string) {
    this.emailAutocomplete?.onSuggestionClicked(suggestion);
  }

  login() {
    if (this.terms == false && this.error) {
      this.error.nativeElement.innerText = 'Você precisa concordar com os termos.';
    }
    else if (this.email == '' && this.error && this.inputEmail) {
      this.error.nativeElement.innerText = 'Insira um endereço de email válido.';
      this.inputEmail.nativeElement?.focus();
    } else {

    }
  }
}