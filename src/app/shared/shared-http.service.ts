import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedHttpService {

  constructor(private http: HttpClient) { }

  makeLogin(url: string, json: string): Observable<User> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<User>(url, json, httpOptions)
      .pipe(
        catchError(error => {
          console.error(`Status: ${error.status}`);
          console.error(`Error: ${JSON.stringify(error.error)}`);
          const defaultUser: User = {
            userId: 0,
            isLogin: '',
            session: '',
            isSessionTokenActive: ''
          };
          return of(defaultUser);
        })
      );
  }
}
