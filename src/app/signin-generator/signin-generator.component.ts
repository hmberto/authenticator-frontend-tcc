import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-generator',
  templateUrl: './signin-generator.component.html',
  styleUrls: ['./signin-generator.component.css']
})
export class SigninGeneratorComponent {
  @ViewChild('error', { static: false }) error?: ElementRef;

  constructor(private router: Router) { }

  choices = [
    { name: 'Selecione uma opção', value: 1 },
    { name: 'Receber código de acesso', value: 2 },
    { name: 'Receber link de acesso', value: 3 }
  ];

  selectedOption: number = 1;

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
      this.router.navigate(['/signin-validator']);
    }
  }

  onClearError() {
    if (this.error) {
      this.error.nativeElement.innerText = '⠀';
    }
  }
}
