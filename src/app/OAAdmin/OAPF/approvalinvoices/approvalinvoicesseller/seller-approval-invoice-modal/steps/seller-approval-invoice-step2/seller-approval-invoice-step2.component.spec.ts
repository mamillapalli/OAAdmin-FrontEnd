import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerApprovalInvoiceStep2Component } from './seller-approval-invoice-step2.component';

describe('SellerApprovalInvoiceStep2Component', () => {
  let component: SellerApprovalInvoiceStep2Component;
  let fixture: ComponentFixture<SellerApprovalInvoiceStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerApprovalInvoiceStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerApprovalInvoiceStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
