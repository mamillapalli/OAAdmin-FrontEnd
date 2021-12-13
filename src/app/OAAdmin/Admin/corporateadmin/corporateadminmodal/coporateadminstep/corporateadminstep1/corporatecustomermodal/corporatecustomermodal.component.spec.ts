import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporatecustomermodalComponent } from './corporatecustomermodal.component';

describe('CorporatecustomermodalComponent', () => {
  let component: CorporatecustomermodalComponent;
  let fixture: ComponentFixture<CorporatecustomermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporatecustomermodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporatecustomermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
