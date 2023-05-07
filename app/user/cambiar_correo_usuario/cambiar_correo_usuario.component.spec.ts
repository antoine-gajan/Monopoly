import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarCorreoComponent } from './cambiar_correo_usuario.component';

describe('PantallaComponent', () => {
  let component: CambiarCorreoComponent;
  let fixture: ComponentFixture<CambiarCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarCorreoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
