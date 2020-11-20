import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PledgePage } from './pledge.page';

describe('PledgePage', () => {
  let component: PledgePage;
  let fixture: ComponentFixture<PledgePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PledgePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PledgePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
