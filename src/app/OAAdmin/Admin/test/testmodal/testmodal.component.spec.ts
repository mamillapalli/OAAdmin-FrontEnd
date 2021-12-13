import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestmodalComponent } from './testmodal.component';

describe('TestmodalComponent', () => {
  let component: TestmodalComponent;
  let fixture: ComponentFixture<TestmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
