import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubastaCardComponent } from './subasta-card.component';

describe('SubastaCardComponent', () => {
  let component: SubastaCardComponent;
  let fixture: ComponentFixture<SubastaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubastaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubastaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
