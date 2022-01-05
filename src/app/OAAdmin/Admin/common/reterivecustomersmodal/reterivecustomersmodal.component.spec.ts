import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReterivecustomersmodalComponent } from './reterivecustomersmodal.component';

describe('ReterivecustomersmodalComponent', () => {
  let component: ReterivecustomersmodalComponent;
  let fixture: ComponentFixture<ReterivecustomersmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReterivecustomersmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReterivecustomersmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
