import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContraseñaComponent } from './cambiar_contraseña_usuario.component';

describe('PantallaComponent', () => {
  let component: CambiarContraseñaComponent;
  let fixture: ComponentFixture<CambiarContraseñaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarContraseñaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarContraseñaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
