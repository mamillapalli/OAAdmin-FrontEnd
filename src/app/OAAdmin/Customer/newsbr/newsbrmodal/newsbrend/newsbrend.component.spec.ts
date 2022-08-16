import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsbrendComponent } from './newsbrend.component';

describe('NewsbrendComponent', () => {
  let component: NewsbrendComponent;
  let fixture: ComponentFixture<NewsbrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsbrendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsbrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
