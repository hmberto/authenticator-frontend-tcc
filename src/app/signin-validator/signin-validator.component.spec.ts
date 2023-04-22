import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninValidatorComponent } from './signin-validator.component';

describe('SigninValidatorComponent', () => {
  let component: SigninValidatorComponent;
  let fixture: ComponentFixture<SigninValidatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninValidatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
