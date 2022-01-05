import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicehistroyComponent } from './invoicehistroy.component';

describe('InvoicehistroyComponent', () => {
  let component: InvoicehistroyComponent;
  let fixture: ComponentFixture<InvoicehistroyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicehistroyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicehistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
