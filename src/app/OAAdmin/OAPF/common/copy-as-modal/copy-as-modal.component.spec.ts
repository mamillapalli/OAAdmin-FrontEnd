import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyAsModalComponent } from './copy-as-modal.component';

describe('CopyAsModalComponent', () => {
  let component: CopyAsModalComponent;
  let fixture: ComponentFixture<CopyAsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopyAsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyAsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
