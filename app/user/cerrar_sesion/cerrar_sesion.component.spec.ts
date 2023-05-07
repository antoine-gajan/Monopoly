import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarSesionComponentAjustes } from './cerrar_sesion.component';

describe('CerrarSesionComponentAjustes', () => {
  let component: CerrarSesionComponentAjustes;
  let fixture: ComponentFixture<CerrarSesionComponentAjustes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CerrarSesionComponentAjustes ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarSesionComponentAjustes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
