import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsbrmainComponent } from './newsbrmain.component';

describe('NewsbrmainComponent', () => {
  let component: NewsbrmainComponent;
  let fixture: ComponentFixture<NewsbrmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsbrmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsbrmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
