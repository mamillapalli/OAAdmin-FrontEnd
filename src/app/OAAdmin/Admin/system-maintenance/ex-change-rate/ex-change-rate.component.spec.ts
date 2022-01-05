import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExChangeRateComponent } from './ex-change-rate.component';

describe('ExChangeRateComponent', () => {
  let component: ExChangeRateComponent;
  let fixture: ComponentFixture<ExChangeRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExChangeRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExChangeRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
