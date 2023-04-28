import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsperarSalaComponent } from './esperar_sala.component';

describe('EsperarSalaComponent', () => {
  let component: EsperarSalaComponent;
  let fixture: ComponentFixture<EsperarSalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsperarSalaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsperarSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
