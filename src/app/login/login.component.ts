import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  terms: boolean = false;

  constructor(private router: Router) { }

  login() {
    if (this.email === 'email') {
      this.router.navigate(['/']);
    } else {
      alert('Nome de usuário ou senha incorretos');
    }
  }
}
