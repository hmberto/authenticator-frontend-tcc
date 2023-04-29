import { Component, ViewChild } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IsUserloggedInService } from '../is-userlogged-in.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild(LoadingComponent) loading: LoadingComponent;

  constructor(private router: Router, private http: HttpClient, private isUserloggedInService: IsUserloggedInService) {
    this.loading = new LoadingComponent();
  }

  private apiUrl = environment.apiUrl;
  private logoutPath = environment.logout;

  userFirstName: string = 'Humberto';
  userLastName: string = 'Araújo';

  private session: string = '';
  private email: string = '';

  ngOnInit() {
    const storage = window.localStorage;
    const isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';
    this.session = storage.getItem('session') || '';
    this.email = storage.getItem('email') || '';

    if (isSessionTokenActive != 'true' || this.session.length != 100 || !this.email) {
      this.router.navigate(['login']);
    }
  }

  editName() {
    const storage = window.localStorage;
    storage.setItem('editName', 'true');
    this.router.navigate(['edit-name']);
  }

  logout() {
    this.showLoading();
    this.clearLocalStorage();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const json = {
      email: this.email,
      session: this.session,
      killAll: false
    }

    this.http.post<String>(`${this.apiUrl}${this.logoutPath}`, json, httpOptions)
      .pipe(
        catchError((error) => {
          this.router.navigate(['']);
          this.isUserloggedInService.setLoggedIn(false);
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.isUserloggedInService.setLoggedIn(false);
        this.router.navigate(['']);
      });
  }

  clearLocalStorage() {
    const storage = window.localStorage;
    storage.removeItem('email');
    storage.removeItem('isLogin');
    storage.removeItem('session');
    storage.removeItem('isSessionTokenActive');
    storage.removeItem('signin-validator-type');
    storage.removeItem('editName');
  }

  showLoading() {
    if (this.loading) {
      setTimeout(() => {
        this.loading.showLoading();
      });
    }
  }

  hideLoading() {
    if (this.loading) {
      setTimeout(() => {
        this.loading.hideLoading();
      });
    }
  }
}
