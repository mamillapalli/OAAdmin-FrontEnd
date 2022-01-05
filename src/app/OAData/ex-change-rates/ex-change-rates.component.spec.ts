import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExChangeRatesComponent } from './ex-change-rates.component';

describe('ExChangeRatesComponent', () => {
  let component: ExChangeRatesComponent;
  let fixture: ComponentFixture<ExChangeRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExChangeRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExChangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
