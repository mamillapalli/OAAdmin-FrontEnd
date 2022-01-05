import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VouchermodalComponent } from './vouchermodal.component';

describe('VouchermodalComponent', () => {
  let component: VouchermodalComponent;
  let fixture: ComponentFixture<VouchermodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VouchermodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VouchermodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
