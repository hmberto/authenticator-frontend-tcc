import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishSigninComponent } from './finish-signin.component';

describe('FinishSigninComponent', () => {
  let component: FinishSigninComponent;
  let fixture: ComponentFixture<FinishSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishSigninComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
