import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';

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

  constructor(private router: Router, private sharedService: SharedService, private http: HttpClient) {
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
    this.sharedService.onHideLoading(this.loading);
  }

  onOptionChange() {
    if (this.selectedOption != 1) {
      this.sharedService.onClearError(this.error);
    }
  }

  generator() {
    if (this.selectedOption == 1 && this.error) {
      this.error.nativeElement.innerText = 'Você precisa escolher uma opção';
    }
    else {
      this.sharedService.onShowLoading(this.loading);

      const json = {
        email: this.email,
        link: this.selectedOption == 3 ? true : false,
        otp: this.selectedOption == 2 ? true : false
      };

      const { apiUrl, registerEmail, httpOptions } = environment;

      this.http.post<User>(`${apiUrl}${registerEmail}`, json, httpOptions)
        .pipe(
          catchError((error) => {
            this.sharedService.onHideLoading(this.loading);
            this.sharedService.onShowError(this.error, 'Não conseguimos enviar o e-mail no momento');
            return throwError(error);
          })
        )
        .subscribe((user) => {
          this.onRedirect(user)
        });
    }
  }

  onRedirect(user: any) {
    this.sharedService.onHideLoading(this.loading);
    if (user.userId >= 1) {
      const storage = window.localStorage;
      storage.setItem('isLogin', user.isLogin.toString());
      storage.setItem('session', user.session);
      storage.setItem('isSessionTokenActive', user.isSessionTokenActive.toString());
      storage.setItem('signin-validator-type', this.selectedOption == 2 ? 'otp' : 'link');

      this.router.navigate(['signin-validator']);
    }
    this.sharedService.onShowError(this.error, 'Não conseguimos enviar o e-mail no momento');
  }
}