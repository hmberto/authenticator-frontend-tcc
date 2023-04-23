import { Component, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-access',
  templateUrl: './confirm-access.component.html',
  styleUrls: ['./confirm-access.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ConfirmAccessComponent {
  constructor(private router: Router, private route: ActivatedRoute) { }

  confirmAccessIp: any = '';
  confirmAccessDate: any = '';
  confirmAccessSession: any = '';
  confirmAccessEmail: any = '';

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('session')?.length == 100) {
      this.confirmAccessIp = this.route.snapshot.queryParamMap.get('ip');
      this.confirmAccessDate = this.route.snapshot.queryParamMap.get('date');
      this.confirmAccessSession = this.route.snapshot.queryParamMap.get('session');
      this.confirmAccessEmail = this.route.snapshot.queryParamMap.get('email');

      this.router.navigate(['/confirm-access']);
    }
    else {
      this.router.navigate(['']);
    }
  }

  confirmAccess(confirm: boolean) {
    if(confirm) {
      console.log(this.confirmAccessIp);
      console.log(this.confirmAccessDate);
      console.log(this.confirmAccessEmail);
      console.log(this.confirmAccessSession);
    }
    else {
      console.log("T2")
    }
  }
}
