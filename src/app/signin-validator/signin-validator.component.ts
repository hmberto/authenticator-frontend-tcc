import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedHttpService } from '../shared/shared-http.service';

@Component({
  selector: 'app-signin-validator',
  templateUrl: './signin-validator.component.html',
  styleUrls: ['./signin-validator.component.css']
})
export class SigninValidatorComponent implements OnInit {
  @ViewChild('inputOTP', { static: false }) inputOTP?: ElementRef<HTMLInputElement>;
  @ViewChild('errorOTP', { static: false }) errorOTP?: ElementRef<HTMLElement>;
  @ViewChild('errorLink', { static: false }) errorLink?: ElementRef<HTMLElement>;

  constructor(private router: Router, @Inject('API_URL') private apiUrl: string, private sharedHttpService: SharedHttpService) { }

  otp = '';
  showOTPAuth = false;
  showLinkAuth = false;
  private authType = '';
  private email = '';

  ngOnInit() {
    const storage = window.localStorage;
    const loginDone = storage.getItem('signin-process-login') == 'done';

    this.authType = storage.getItem('signin-validator-type') || '';
    this.email = storage.getItem('email') || '';

    if (loginDone && this.email && this.authType == 'otp') {
      this.showOTPAuth = true;
    }
    else if (loginDone && this.email && this.authType == 'link') {
      this.showLinkAuth = true;
    }
    else {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    if (this.showOTPAuth) {
      this.focusAtOTP();
    }
  }

  onOTPChange() {
    this.onClearError();
  }

  onChangeType() {
    this.router.navigate(['signin-generator']);
  }

  onClearError() {
    if (this.errorOTP) {
      this.errorOTP.nativeElement.innerText = '⠀';
    }
  }

  focusAtOTP() {
    if (this.inputOTP) {
      this.inputOTP.nativeElement.focus();
    }
  }

  validatorOTP() {
    if (this.otp.length != 6 && this.errorOTP) {
      this.errorOTP.nativeElement.innerText = 'Insira um código de acesso válido.';
      this.focusAtOTP();
    }
    else {
      const otpObject = {
        email: this.email,
        sessionTokenOrOTP: this.otp,
        approve: 'true'
      };
      const jsonEmail = JSON.stringify(otpObject);

      this.sharedHttpService.makeLogin(`${this.apiUrl}/api/validate-otp`, jsonEmail)
        .subscribe(user => {
          if (user == null) {
            const storage = window.localStorage;
            storage.removeItem('signin-validator-type');
            storage.setItem('signin-process-validator', 'done');

            if (storage.getItem('isLogin') == 'false') {
              this.router.navigate(['finish-signin']);
            }
            else {
              this.router.navigate(['']);
            }
          }
          else if (user.userId == 0) {
            if (this.errorOTP) {
              this.errorOTP.nativeElement.innerText = 'Insira um código de acesso válido.';
            }
          }
        });
    }
  }

  validatorLink() {
    if (this.errorLink) {
      this.errorLink.nativeElement.innerText = 'Não foi possível confirmar seu acesso.';
    } else {
      window.localStorage.setItem('signin-process-validator', 'done');
      this.router.navigate(['finish-signin']);
    }
  }
}