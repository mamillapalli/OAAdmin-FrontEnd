import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RmDoComponent } from './rm-do.component';

describe('RmDoComponent', () => {
  let component: RmDoComponent;
  let fixture: ComponentFixture<RmDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RmDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RmDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
