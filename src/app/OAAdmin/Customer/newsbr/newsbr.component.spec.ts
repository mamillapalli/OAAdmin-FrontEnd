import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsbrComponent } from './newsbr.component';

describe('NewsbrComponent', () => {
  let component: NewsbrComponent;
  let fixture: ComponentFixture<NewsbrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsbrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsbrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
