import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaInvitadoComponent } from './pantalla_invitado.component';

describe('PantallaInvitadoComponent', () => {
  let component: PantallaInvitadoComponent;
  let fixture: ComponentFixture<PantallaInvitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PantallaInvitadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PantallaInvitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
