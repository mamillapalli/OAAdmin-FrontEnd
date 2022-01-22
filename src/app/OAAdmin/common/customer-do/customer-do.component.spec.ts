import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDOComponent } from './customer-do.component';

describe('CustomerDOComponent', () => {
  let component: CustomerDOComponent;
  let fixture: ComponentFixture<CustomerDOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
