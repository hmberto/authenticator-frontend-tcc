import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  onValidateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  onValidateName(name: string) {
    const regex = /^[a-zA-ZÀ-ÿ]+$/;
    return regex.test(name);
  }

  onShowLoading(loading: any) {
    if (loading) {
      setTimeout(() => {
        loading.showLoading();
      });
    }
  }

  onHideLoading(loading: any) {
    if (loading) {
      setTimeout(() => {
        loading.hideLoading();
      });
    }
  }

  onClearError(error: any) {
    if (error) {
      error.nativeElement.innerText = '⠀';
    }
  }

  onShowError(error: any, message: string) {
    if (error) {
      error.nativeElement.innerText = message;
    }
  }
}
