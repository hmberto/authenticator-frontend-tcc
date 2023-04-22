import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin-generator',
  templateUrl: './signin-generator.component.html',
  styleUrls: ['./signin-generator.component.css']
})
export class SigninGeneratorComponent {
  @ViewChild('error', { static: false }) error?: ElementRef;

  constructor(private router: Router, private route: ActivatedRoute) { }

  choices = [
    { name: 'Selecione uma opção', value: 1 },
    { name: 'Receber código de acesso', value: 2 },
    { name: 'Receber link de acesso', value: 3 }
  ];

  selectedOption: number = 1;
  username: any = '';
  domain: any = '';

  ngOnInit() {
    this.username = this.route.snapshot.queryParamMap.get('username');
    this.domain = this.route.snapshot.queryParamMap.get('domain');

    if(this.username == null || this.username == null) {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {

  }

  onOptionChange() {
    if(this.selectedOption != 1) {
      this.onClearError();
    }
  }

  generator() {
    if (this.selectedOption == 1 && this.error) {
      this.error.nativeElement.innerText = 'Você precisa escolher uma opção.';
    }
    else {
      this.onRedirect(this.selectedOption);
    }
  }

  onRedirect(type: number) {
    if(type == 2) {
      this.router.navigate(['/signin-validator'], { queryParams: { type: 'otp', username: this.username, domain: this.domain } });
    }
    else if(type == 3) {
      this.router.navigate(['/signin-validator'], { queryParams: { type: 'link', username: this.username, domain: this.domain } });
    }
    else {
      this.router.navigate(['/signin-validator'], { queryParams: { type: 'error' } });
    }
  }

  onClearError() {
    if (this.error) {
      this.error.nativeElement.innerText = '⠀';
    }
  }
}
