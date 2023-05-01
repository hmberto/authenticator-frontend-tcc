import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SharedService } from '../shared/shared.service';

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

  constructor(private router: Router, private http: HttpClient, private sharedService: SharedService) {
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
    const editName = storage.getItem('editName') || '';
    this.session = storage.getItem('session') || '';
    this.isLogin = storage.getItem('isLogin') || '';
    this.isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';
    this.email = storage.getItem('email') || '';

    if (!this.email || this.session.length != 100 || this.isSessionTokenActive != 'true') {
      this.router.navigate(['login']);
    }
    else if (this.isLogin == 'true' && editName != 'true') {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    this.focusAtFirstName();
    this.sharedService.onHideLoading(this.loading);
  }

  onFirstNameChange() {
    if (!this.sharedService.onValidateName(this.firstName)) {
      this.sharedService.onShowError(this.error, 'Primeiro nome inválido');
    }
    else {
      this.sharedService.onClearError(this.error);
    }
  }

  onLastNameChange() {
    if (!this.sharedService.onValidateName(this.lastName)) {
      this.sharedService.onShowError(this.error, 'Sobrenome inválido');
    }
    else {
      this.sharedService.onClearError(this.error);
    }
  }

  updateName() {
    if (!this.sharedService.onValidateName(this.firstName) || !this.sharedService.onValidateName(this.lastName)) {
      this.sharedService.onShowError(this.error, 'Nome inválido');
    }
    else if (this.firstName == this.lastName) {
      this.sharedService.onShowError(this.error, 'Nome igual ao sobrenome');
    }
    else {
      this.onSaveName()
    }
  }

  onSaveName() {
    this.sharedService.onShowLoading(this.loading);

    const json = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      session: this.session
    };

    const { apiUrl, registerName, httpOptions } = environment;

    this.http.put<string>(`${apiUrl}${registerName}`, json, httpOptions)
      .pipe(
        catchError((error) => {
          this.sharedService.onHideLoading(this.loading);
          this.sharedService.onShowError(this.error, 'Não foi possivel salver o nome digitado');
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.sharedService.onHideLoading(this.loading);
        this.onRedirect(data)
      });
  }

  onRedirect(data: any) {
    const storage = window.localStorage;
    storage.removeItem('editName');
    storage.removeItem('isLogin');

    const url = this.router.url;

    if (url == '/edit-name') {
      this.router.navigate(['profile']);
    }
    else {
      this.router.navigate(['']);
    }
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