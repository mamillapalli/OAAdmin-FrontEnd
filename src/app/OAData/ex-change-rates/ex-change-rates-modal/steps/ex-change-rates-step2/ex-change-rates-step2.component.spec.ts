import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExChangeRatesStep2Component } from './ex-change-rates-step2.component';

describe('ExChangeRatesStep2Component', () => {
  let component: ExChangeRatesStep2Component;
  let fixture: ComponentFixture<ExChangeRatesStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExChangeRatesStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExChangeRatesStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
