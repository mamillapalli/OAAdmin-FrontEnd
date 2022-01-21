import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekEndComponent } from './week-end.component';

describe('WeekEndComponent', () => {
  let component: WeekEndComponent;
  let fixture: ComponentFixture<WeekEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeekEndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
