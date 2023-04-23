import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedHttpService } from '../shared/shared-http.service';

@Component({
  selector: 'app-finish-signin',
  templateUrl: './finish-signin.component.html',
  styleUrls: ['./finish-signin.component.css']
})
export class FinishSigninComponent {
  @ViewChild('inputFirstName', { static: false }) inputFirstName?: ElementRef;
  @ViewChild('inputLastName', { static: false }) inputLastName?: ElementRef;
  @ViewChild('error', { static: false }) error?: ElementRef;

  constructor(private router: Router, @Inject('API_URL') private apiUrl: string, private sharedHttpService: SharedHttpService) { }

  firstName = '';
  lastName = '';
  private email = '';
  private session = '';

  ngOnInit() {
    const storage = window.localStorage;
    this.email = storage.getItem('email') || '';
    this.session = storage.getItem('session') || '';

    if (!this.email || !this.session) {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.focusAtFirstName();
  }

  onFirstNameChange() {
    if (this.error && !this.validateNames(this.firstName)) {
      this.error.nativeElement.innerText = 'Primeiro nome inválido.';
    }
    else {
      this.onClearError();
    }
  }

  onLastNameChange() {
    if (this.error && !this.validateNames(this.lastName)) {
      this.error.nativeElement.innerText = 'Sobrenome inválido.';
    }
    else {
      this.onClearError();
    }
  }

  updateName() {
    if (this.error && (!this.validateNames(this.firstName) || !this.validateNames(this.lastName))) {
      this.error.nativeElement.innerText = 'Nome inválido.';
    }
    else {
      const emailObject = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        session: this.session
      };
      const jsonEmail = JSON.stringify(emailObject);

      this.sharedHttpService.makeLogin(`${this.apiUrl}/api/register-name`, jsonEmail)
        .subscribe(user => {
          const storage = window.localStorage;

          storage.setItem('signin-process-finish', 'done');

          this.router.navigate(['']);
        });
    }
  }

  onClearError() {
    if (this.error) {
      this.error.nativeElement.innerText = '⠀';
    }
  }

  validateNames(name: string) {
    const onlyLettersRegex = /^[a-zA-ZÀ-ÿ]+$/;

    if (!name.match(onlyLettersRegex)) {
      return false;
    }

    return true;
  }

  focusAtFirstName() {
    if (this.inputFirstName) {
      this.inputFirstName.nativeElement.focus();
    }
  }

  focusAtLastName() {
    if (this.inputLastName) {
      this.inputLastName.nativeElement.focus();
    }
  }
}
