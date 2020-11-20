import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CphReceivePage } from './cph-receive.page';

describe('CphReceivePage', () => {
  let component: CphReceivePage;
  let fixture: ComponentFixture<CphReceivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CphReceivePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CphReceivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
