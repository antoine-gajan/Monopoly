import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityCardComponent } from './electricity-card.component';

describe('ElectricityCardComponent', () => {
  let component: ElectricityCardComponent;
  let fixture: ComponentFixture<ElectricityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricityCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectricityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
