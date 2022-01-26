import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriDataTablesComponent } from './tri-data-tables.component';

describe('TriDataTablesComponent', () => {
  let component: TriDataTablesComponent;
  let fixture: ComponentFixture<TriDataTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TriDataTablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TriDataTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
