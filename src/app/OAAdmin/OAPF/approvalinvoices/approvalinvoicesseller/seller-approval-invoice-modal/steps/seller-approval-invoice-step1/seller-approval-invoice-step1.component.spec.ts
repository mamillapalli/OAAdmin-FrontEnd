import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerApprovalInvoiceStep1Component } from './seller-approval-invoice-step1.component';

describe('SellerApprovalInvoiceStep1Component', () => {
  let component: SellerApprovalInvoiceStep1Component;
  let fixture: ComponentFixture<SellerApprovalInvoiceStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerApprovalInvoiceStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerApprovalInvoiceStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
