import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedHttpService } from '../shared/shared-http.service';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';
import { IsUserloggedInService } from '../is-userlogged-in.service'

@Component({
  selector: 'app-signin-validator',
  templateUrl: './signin-validator.component.html',
  styleUrls: ['./signin-validator.component.css']
})
export class SigninValidatorComponent implements OnInit {
  @ViewChild('inputOTP', { static: false }) inputOTP?: ElementRef<HTMLInputElement>;
  @ViewChild('errorOTP', { static: false }) errorOTP?: ElementRef<HTMLElement>;
  @ViewChild('errorLink', { static: false }) errorLink?: ElementRef<HTMLElement>;
  @ViewChild(LoadingComponent) loading: LoadingComponent;

  constructor(private router: Router, private sharedHttpService: SharedHttpService, private isUserloggedInService: IsUserloggedInService) {
    this.loading = new LoadingComponent(); 
  }

  otp = '';
  showOTPAuth = false;
  showLinkAuth = false;
  email = '';
  private session = '';
  private isLogin = '';

  ngOnInit() {
    const storage = window.localStorage;
    const authType = storage.getItem('signin-validator-type') || '';
    this.session = storage.getItem('session') || '';
    this.isLogin = storage.getItem('isLogin') || '';
    this.email = storage.getItem('email') || '';

    if (this.email && authType == 'otp') {
      this.showOTPAuth = true;
    }
    else if (this.isLogin === 'true' && this.session.length == 100 && this.email && authType == 'link') {
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
      this.errorOTP.nativeElement.innerText = 'Insira um código de acesso válido';
      this.focusAtOTP();
    }
    else {
      this.showLoading();
      const otpObject = {
        email: this.email,
        otp: this.otp
      };
      const jsonEmail = JSON.stringify(otpObject);

      const { apiUrl, validateOtp } = environment;
      this.sharedHttpService.makeLogin(`${apiUrl}${validateOtp}`, jsonEmail)
        .subscribe(user => {
          this.onRedirect(user);
        });
    }
  }

  onRedirect(user: any) {
    this.hideLoading();
    if (user.userId >= 1 && user.isSessionTokenActive && user.session.length == 100) {
      const storage = window.localStorage;
      storage.removeItem('signin-validator-type');
      storage.setItem('isLogin', user.isLogin.toString());
      storage.setItem('session', user.session);
      storage.setItem('isSessionTokenActive', user.isSessionTokenActive.toString());

      this.isUserloggedInService.setLoggedIn(true);

      if (this.isLogin == 'false') {
        this.router.navigate(['finish-signin']);
      }
      else {
        this.router.navigate(['']);
      }
    }
    else if (user.userId == 0) {
      if (this.errorOTP) {
        this.errorOTP.nativeElement.innerText = 'Não foi possivel validar o código digitado';
      }
    }
  }

  validatorLink() {
    if (this.errorLink) {
      this.errorLink.nativeElement.innerText = 'Não foi possível confirmar seu acesso.';
    } else {
      this.router.navigate(['finish-signin']);
    }
  }
}