import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';
import { IsUserloggedInService } from '../is-userlogged-in.service'
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';

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

  constructor(private router: Router, private sharedService: SharedService, private isUserloggedInService: IsUserloggedInService, private http: HttpClient) {
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
    this.sharedService.onHideLoading(this.loading);
  }

  onOTPChange() {
    this.onClearError();
  }

  onChangeType() {
    this.router.navigate(['signin-generator']);
  }

  onClearError() {
    this.sharedService.onClearError(this.errorOTP);
    this.sharedService.onClearError(this.errorLink);
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
      this.sharedService.onShowLoading(this.loading);

      const json = {
        email: this.email,
        otp: this.otp
      };

      const { apiUrl, validateOtp, httpOptions } = environment;

      this.http.post<User>(`${apiUrl}${validateOtp}`, json, httpOptions)
        .pipe(
          catchError((error) => {
            this.sharedService.onHideLoading(this.loading);
            this.sharedService.onShowError(this.errorOTP, 'Não foi possivel validar o código digitado');
            return throwError(error);
          })
        )
        .subscribe((user) => {
          this.sharedService.onHideLoading(this.loading);
          this.onRedirectOTP(user);
        });
    }
  }

  onRedirectOTP(user: User) {
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
      this.sharedService.onShowError(this.errorOTP, 'Não foi possivel validar o código digitado');
    }
  }

  validatorLink() {
    this.sharedService.onClearError(this.errorLink);
    this.sharedService.onShowLoading(this.loading);

    const json = {
      email: this.email,
      sessionToken: this.session,
    }

    const { apiUrl, checkSessionToken, httpOptions } = environment;

    this.http.post<string>(`${apiUrl}${checkSessionToken}`, json, httpOptions)
      .pipe(
        catchError((error) => {
          this.sharedService.onHideLoading(this.loading);
          this.sharedService.onShowError(this.errorLink, 'Não foi possivel confirmar o login');
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.sharedService.onHideLoading(this.loading);
        const resp = JSON.parse(JSON.stringify(data));

        this.onRedirectLink(resp);
      });
  }

  onRedirectLink(resp: any) {
    if (resp.Status == 'Valid session') {
      const storage = window.localStorage;
      storage.removeItem('signin-validator-type');
      storage.setItem('isSessionTokenActive', 'true');
      this.isUserloggedInService.setLoggedIn(true);
      this.router.navigate(['']);
    }
    else if (resp.Status == 'Unconfirmed session') {
      this.sharedService.onShowError(this.errorLink, 'Você não confirmou seu login');
    }
    else if (resp.Status == 'Invalid session token') {
      this.sharedService.onShowError(this.errorLink, 'Tivemos um problema com seu login');
    }
    else {
      this.sharedService.onShowError(this.errorLink, 'Não foi possivel confirmar o login');
    }
  }
}