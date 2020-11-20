import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPasswordPage } from './payment-password.page';

describe('PaymentPasswordPage', () => {
  let component: PaymentPasswordPage;
  let fixture: ComponentFixture<PaymentPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
