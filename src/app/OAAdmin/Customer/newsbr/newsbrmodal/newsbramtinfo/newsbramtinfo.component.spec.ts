import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsbramtinfoComponent } from './newsbramtinfo.component';

describe('NewsbramtinfoComponent', () => {
  let component: NewsbramtinfoComponent;
  let fixture: ComponentFixture<NewsbramtinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsbramtinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsbramtinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
