import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CphSendPage } from './cph-send.page';

describe('CphSendPage', () => {
  let component: CphSendPage;
  let fixture: ComponentFixture<CphSendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CphSendPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CphSendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
