import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExChangeRatesStep1Component } from './ex-change-rates-step1.component';

describe('ExChangeRatesStep1Component', () => {
  let component: ExChangeRatesStep1Component;
  let fixture: ComponentFixture<ExChangeRatesStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExChangeRatesStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExChangeRatesStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
