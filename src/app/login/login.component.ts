import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild('inputEmail', { static: false }) inputEmail?: ElementRef;
  @ViewChild('error', { static: false }) error?: ElementRef;

  email: string = '';
  terms: boolean = false;

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.inputEmail) {
      this.inputEmail.nativeElement.focus();
    }
  }

  constructor(private router: Router) { }

  onEmailChange(event: any) {
    console.log('Novo email digitado:', event);
  }

  onTermsChange(event: any) {
    if (this.terms == true && this.error) {
      this.error.nativeElement.innerText = '';
    }
  }

  login() {
    if (this.terms == false && this.error) {
      this.error.nativeElement.innerText = 'Você precisa concordar com os termos.';
    }
    else if (this.email == '' && this.error && this.inputEmail) {
      this.error.nativeElement.innerText = 'Insira um endereço de email válido.';
      this.inputEmail.nativeElement?.focus();
    } else {
      
    }
  }
}
