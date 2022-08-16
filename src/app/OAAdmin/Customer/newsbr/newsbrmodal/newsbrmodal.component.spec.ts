import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsbrmodalComponent } from './newsbrmodal.component';

describe('NewsbrmodalComponent', () => {
  let component: NewsbrmodalComponent;
  let fixture: ComponentFixture<NewsbrmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsbrmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsbrmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
