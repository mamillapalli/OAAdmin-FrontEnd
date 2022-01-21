import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAdviseComponent } from './credit-advise.component';

describe('CreditAdviseComponent', () => {
  let component: CreditAdviseComponent;
  let fixture: ComponentFixture<CreditAdviseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditAdviseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditAdviseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
