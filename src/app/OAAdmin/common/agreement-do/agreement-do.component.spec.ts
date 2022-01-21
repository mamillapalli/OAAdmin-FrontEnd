import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementDoComponent } from './agreement-do.component';

describe('AgreementDoComponent', () => {
  let component: AgreementDoComponent;
  let fixture: ComponentFixture<AgreementDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementDoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
