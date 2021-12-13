import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Invoicestep4Component } from './invoicestep4.component';

describe('Invoicestep4Component', () => {
  let component: Invoicestep4Component;
  let fixture: ComponentFixture<Invoicestep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Invoicestep4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Invoicestep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
