import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IsUserloggedInService {
  loggedInSubject = new Subject<boolean>();
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor() { }

  setLoggedIn(loggedIn: boolean) {
    this.loggedInSubject.next(loggedIn);
  }
}