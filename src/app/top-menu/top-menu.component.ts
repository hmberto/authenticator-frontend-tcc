import { Component, ChangeDetectorRef } from '@angular/core';
import { IsUserloggedInService } from '../is-userlogged-in.service'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent {
  constructor (private isUserloggedInService: IsUserloggedInService, private cdr: ChangeDetectorRef) {}

  loggedIn$: Observable<boolean> = new Observable<boolean>();

  ngOnInit() {
    this.loggedIn$ = this.isUserloggedInService.loggedIn$;
  }

  ngAfterViewInit() {
    const storage = window.localStorage;
    const session = storage.getItem('session') || '';
    const isSessionTokenActive = storage.getItem('isSessionTokenActive') || '';

    if(session.length == 100 && isSessionTokenActive == 'true') {
      this.isUserloggedInService.setLoggedIn(true)
    }
    else {
      this.isUserloggedInService.setLoggedIn(false)
    }

    this.cdr.detectChanges();
  }
}