import { Component, Injectable, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedHttpService } from '../shared/shared-http.service';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-confirm-access',
  templateUrl: './confirm-access.component.html',
  styleUrls: ['./confirm-access.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class ConfirmAccessComponent {
  @ViewChild(LoadingComponent) loading: LoadingComponent;
  constructor(private router: Router, private route: ActivatedRoute, private sharedHttpService: SharedHttpService) {
    this.loading = new LoadingComponent();
  }

  confirmAccessDate: any = 'TESTE';
  confirmAccessIp: any = 'TESTE';

  confirmAccessToken: any = '';
  confirmAccessSession: any = '';
  confirmAccessEmail: any = '';

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('session')?.length == 100 && this.route.snapshot.queryParamMap.get('token')?.length == 50) {
      this.confirmAccessToken = this.route.snapshot.queryParamMap.get('token');
      this.confirmAccessSession = this.route.snapshot.queryParamMap.get('session');
      this.confirmAccessEmail = this.route.snapshot.queryParamMap.get('email');

      this.router.navigate(['confirm-access']);
    }
    else {
      this.router.navigate(['error']);
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

  confirmAccess(confirm: boolean) {
    this.showLoading();
    if (confirm) {
      const emailObject = {
        email: this.confirmAccessEmail,
        sessionToken: this.confirmAccessSession,
        emailToken: this.confirmAccessToken,
        approve: true
      };
      const jsonEmail = JSON.stringify(emailObject);

      const { apiUrl, validateAccessLink } = environment;
      this.sharedHttpService.makeLogin(`${apiUrl}${validateAccessLink}`, jsonEmail)
        .subscribe(user => {
          this.onRedirect(user);
        });
    }
    else {
      this.router.navigate(['']);
    }
  }

  onRedirect(user: any) {
    if (user == null) {
      this.router.navigate(['']);
    }
    else {
      this.router.navigate(['']);
    }
  }
}
