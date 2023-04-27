import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProprietyCardComponent } from './propriety-card.component';

describe('ProprietyCardComponent', () => {
  let component: ProprietyCardComponent;
  let fixture: ComponentFixture<ProprietyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProprietyCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProprietyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
