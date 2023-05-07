import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatCardComponent } from './heat-card.component';

describe('HeatCardComponent', () => {
  let component: HeatCardComponent;
  let fixture: ComponentFixture<HeatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeatCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
