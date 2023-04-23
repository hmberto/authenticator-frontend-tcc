import { query } from '@angular/animations';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin-validator',
  templateUrl: './signin-validator.component.html',
  styleUrls: ['./signin-validator.component.css']
})
export class SigninValidatorComponent {
  @ViewChild('inputOTP', { static: false }) inputOTP?: ElementRef;
  @ViewChild('errorOTP', { static: false }) errorOTP?: ElementRef;
  @ViewChild('errorLink', { static: false }) errorLink?: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute) { }

  otp: string = '';
  showOTPAuth = false;
  showLinkAuth = false;
  authType: any = '';
  username: any = '';
  domain: any = '';

  ngOnInit() {
    this.authType = this.route.snapshot.queryParamMap.get('type');
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.domain = this.route.snapshot.queryParamMap.get('domain');

    if(this.username == null || this.username == null) {
      this.router.navigate(['login']);
    }

    if (this.authType === 'otp') {
      this.showOTPAuth = true;
      this.focusAtOTP();
    }
    else if(this.authType === 'link') {
      this.showLinkAuth = true;
    }
    else {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    if(this.showOTPAuth) {
      this.focusAtOTP();
    }
  }

  onOTPChange(newValue: string) {
    this.onClearError();
  }

  onChangeType() {
    this.router.navigate(['/signin-generator'], { queryParams: { username: this.username, domain: this.domain } });
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
      this.router.navigate(['']);
    }
  }

  validatorLink() {
    this.router.navigate(['/finish-signin'], { queryParams: { username: this.username, domain: this.domain } });

    if (this.errorLink) {
      this.errorLink.nativeElement.innerText = 'Não foi possivel confirmar seu acesso.';
    }
    else {
      this.router.navigate(['']);
    }
  }
}
