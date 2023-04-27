import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JailCardComponent } from './jail-card.component';

describe('JailComponent', () => {
  let component: JailCardComponent;
  let fixture: ComponentFixture<JailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JailCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
