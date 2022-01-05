import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExChangeRatesModalComponent } from './ex-change-rates-modal.component';

describe('ExChangeRatesModalComponent', () => {
  let component: ExChangeRatesModalComponent;
  let fixture: ComponentFixture<ExChangeRatesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExChangeRatesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExChangeRatesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
