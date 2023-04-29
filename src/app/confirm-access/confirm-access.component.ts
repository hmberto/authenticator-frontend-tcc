import { Component, Injectable, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedHttpService } from '../shared/shared-http.service';
import { LoadingComponent } from '../loading/loading.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AccessLink } from '../interfaces/access-link.interface';

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
  constructor(private router: Router, private route: ActivatedRoute, private sharedHttpService: SharedHttpService, private http: HttpClient) {
    this.loading = new LoadingComponent();
  }

  private apiUrl = environment.apiUrl;
  private validateAccessLink = environment.validateAccessLink;
  private checkAccessLink = environment.checkAccessLink;

  confirmAccessDate: any = '';
  confirmAccessIp: any = '';
  confirmAccessBrowser: any = '';
  confirmAccessOS: any = '';
  confirmAccessSameIP: boolean = false;

  confirmAccessToken: any = '';
  confirmAccessSession: any = '';
  confirmAccessEmail: any = '';

  showPage: boolean = false;
  showPopup: boolean = false;

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get('session')?.length == 100 && this.route.snapshot.queryParamMap.get('token')?.length == 50) {
      this.confirmAccessToken = this.route.snapshot.queryParamMap.get('token');
      this.confirmAccessSession = this.route.snapshot.queryParamMap.get('session');
      this.confirmAccessEmail = this.route.snapshot.queryParamMap.get('email');

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {}
      });

      this.getConfirmationData()
    }
    else {
      this.router.navigate(['404']);
    }
  }

  ngAfterViewInit() {
    this.showLoading();
  }

  showLoading() {
    this.onHidePopup();
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

  onShowPopup() {
    this.showPopup = true;
  }

  onHidePopup() {
    this.showPopup = false;
  }

  getConfirmationData() {
    this.http.get<AccessLink>(`${this.apiUrl}${this.checkAccessLink}${this.confirmAccessToken}`)
    .pipe(
      catchError((error) => {
        this.router.navigate(['']);
        return throwError(error);
      })
    )
    .subscribe((data) => {
      this.confirmAccessDate = data.createdAt;
      this.confirmAccessIp = data.requestIP;
      this.confirmAccessBrowser = data.requestBrowser;
      this.confirmAccessOS = data.requestOS;
      this.confirmAccessSameIP = data.sameIP;
  
      this.hideLoading();
      this.showPage = true;
    });
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

      this.sharedHttpService.makeLogin(`${this.apiUrl}${this.validateAccessLink}`, jsonEmail)
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
