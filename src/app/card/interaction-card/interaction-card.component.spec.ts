import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionCardComponent } from './interaction-card.component';

describe('BuyCardComponent', () => {
  let component: InteractionCardComponent;
  let fixture: ComponentFixture<InteractionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
