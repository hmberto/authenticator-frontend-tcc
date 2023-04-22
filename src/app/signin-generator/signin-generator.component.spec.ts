import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninGeneratorComponent } from './signin-generator.component';

describe('SigninGeneratorComponent', () => {
  let component: SigninGeneratorComponent;
  let fixture: ComponentFixture<SigninGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SigninGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
