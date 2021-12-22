import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementEndComponent } from './agreement-end.component';

describe('AgreementEndComponent', () => {
  let component: AgreementEndComponent;
  let fixture: ComponentFixture<AgreementEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementEndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
