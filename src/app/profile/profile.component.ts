import { Component, ViewChild } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IsUserloggedInService } from '../is-userlogged-in.service'
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  @ViewChild(LoadingComponent) loading: LoadingComponent;

  constructor(private router: Router, private http: HttpClient, private isUserloggedInService: IsUserloggedInService, private sharedService: SharedService) {
    this.loading = new LoadingComponent();
  }

  private apiUrl = environment.apiUrl;
  private logoutPath = environment.logout;
  private httpOptions = environment.httpOptions;

  userFirstName: string = '';
  userLastName: string = '';

  private session: string = '';
  private email: string = '';

  showPage: boolean = false;

  ngOnInit() {
    this.sharedService.onShowLoading(this.loading);

    const storage = window.localStorage;
    const isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';
    this.session = storage.getItem('session') || '';
    this.email = storage.getItem('email') || '';

    if (isSessionTokenActive != 'true' || this.session.length != 100 || !this.email) {
      this.router.navigate(['login']);
    }
    else {
      this.getUser();
    }
  }

  ngAfterViewInit() {
    this.showPage = false;
    this.sharedService.onShowLoading(this.loading);
  }

  getUser() {
    this.showPage = true;
    this.sharedService.onHideLoading(this.loading);

    const { apiUrl, getUserData, httpOptions } = environment;

    this.http.get<string>(`${apiUrl}${getUserData}${this.email}`, httpOptions)
      .pipe(
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      )
      .subscribe((data) => {
        this.sharedService.onHideLoading(this.loading);
        this.showPage = true;

        const resp = JSON.parse(JSON.stringify(data));

        this.userFirstName = resp.firstName;
        this.userLastName = resp.lastName;
      });
  }

  editName() {
    const storage = window.localStorage;
    storage.setItem('editName', 'true');
    this.router.navigate(['edit-name']);
  }

  logout() {
    this.sharedService.onShowLoading(this.loading);
    this.clearLocalStorage();

    const json = {
      email: this.email,
      session: this.session,
      killAll: false
    }

    this.http.put<string>(`${this.apiUrl}${this.logoutPath}`, json, this.httpOptions)
      .pipe(
        catchError((error) => {
          this.isUserloggedInService.setLoggedIn(false);
          this.router.navigate(['']);
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
}