import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeModalPage } from './pincode-modal.page';

describe('PincodeModalPage', () => {
  let component: PincodeModalPage;
  let fixture: ComponentFixture<PincodeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PincodeModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
