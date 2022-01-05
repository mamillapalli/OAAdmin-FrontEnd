import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemMaintenanceComponent } from './system-maintenance.component';

describe('SystemMaintenanceComponent', () => {
  let component: SystemMaintenanceComponent;
  let fixture: ComponentFixture<SystemMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
