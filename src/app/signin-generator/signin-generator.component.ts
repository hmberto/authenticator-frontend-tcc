import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedHttpService } from '../shared/shared-http.service';
import { LoadingComponent } from '../loading/loading.component';

interface Option {
  name: string;
  value: number;
}

@Component({
  selector: 'app-signin-generator',
  templateUrl: './signin-generator.component.html',
  styleUrls: ['./signin-generator.component.css']
})
export class SigninGeneratorComponent {
  @ViewChild('error', { static: false }) error?: ElementRef<HTMLParagraphElement>;
  @ViewChild(LoadingComponent) loading: LoadingComponent;

  choices: Option[] = [
    { name: 'Selecione uma opção', value: 1 },
    { name: 'Receber código de acesso', value: 2 },
    { name: 'Receber link de acesso', value: 3 }
  ];

  selectedOption = 1;
  email = '';

  constructor(private router: Router, private sharedHttpService: SharedHttpService, @Inject('API_URL') private apiUrl: string) {
    this.loading = new LoadingComponent();
  }

  ngOnInit() {
    const storage = window.localStorage;
    const isLogin = storage.getItem('isLogin') || '';
    const isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';
    this.email = storage.getItem('email') || '';

    if (!this.email || isLogin === 'false' || isSessionTokenActive === 'true') {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
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

  onOptionChange() {
    if (this.selectedOption != 1) {
      this.onClearError();
    }
  }

  generator() {
    if (this.selectedOption == 1 && this.error) {
      this.error.nativeElement.innerText = 'Você precisa escolher uma opção';
    }
    else {
      this.showLoading();
      const emailObject = {
        email: this.email,
        link: this.selectedOption == 3 ? true : false,
        otp: this.selectedOption == 2 ? true : false
      };

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
      storage.setItem('isLogin', user.isLogin.toString());
      storage.setItem('session', user.session);
      storage.setItem('isSessionTokenActive', user.isSessionTokenActive.toString());
      storage.setItem('signin-validator-type', this.selectedOption == 2 ? 'otp' : 'link');

      this.router.navigate(['signin-validator']);
    }
    if (this.error) {
      this.error.nativeElement.innerText = 'Não foi possivel validar o e-mail digitado';
    }
  }

  onClearError() {
    if (this.error) {
      this.error.nativeElement.innerText = '⠀';
    }
  }
}