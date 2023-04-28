import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedHttpService } from '../shared/shared-http.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-finish-signin',
  templateUrl: './finish-signin.component.html',
  styleUrls: ['./finish-signin.component.css']
})
export class FinishSigninComponent {
  @ViewChild('inputFirstName', { static: false }) inputFirstName?: ElementRef;
  @ViewChild('inputLastName', { static: false }) inputLastName?: ElementRef;
  @ViewChild('error', { static: false }) error?: ElementRef;
  @ViewChild(LoadingComponent) loading: LoadingComponent;

  constructor(private router: Router, @Inject('API_URL') private apiUrl: string, private sharedHttpService: SharedHttpService) {
    this.loading = new LoadingComponent();
  }

  firstName = '';
  lastName = '';
  private email = '';
  private session = '';
  private isSessionTokenActive = '';
  private isLogin = '';

  ngOnInit() {
    const storage = window.localStorage;
    this.session = storage.getItem('session') || '';
    this.isLogin = storage.getItem('isLogin') || '';
    this.isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';
    this.email = storage.getItem('email') || '';

    if (this.isLogin === 'true' || !this.email || this.session.length != 100) {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.focusAtFirstName();
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
      this.error.nativeElement.innerText = 'Nome inválido';
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
          this.onRedirect(user);
        });
    }
  }

  onRedirect(user: any) {
    if (user == null) {
      const storage = window.localStorage;
      storage.removeItem('isLogin');

      this.router.navigate(['']);
    }
    else {
      if (this.error) {
        this.error.nativeElement.innerText = 'Não foi possivel salver o nome digitado';
      }
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
