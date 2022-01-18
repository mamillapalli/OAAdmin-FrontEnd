import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerApprovalInvoiceModalComponent } from './seller-approval-invoice-modal.component';

describe('SellerApprovalInvoiceModalComponent', () => {
  let component: SellerApprovalInvoiceModalComponent;
  let fixture: ComponentFixture<SellerApprovalInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerApprovalInvoiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerApprovalInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
