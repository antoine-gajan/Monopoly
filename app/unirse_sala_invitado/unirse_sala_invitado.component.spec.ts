import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnirseSalaInvitadoComponent } from './unirse_sala_invitado.component';

describe('UnirseSalaInvitadoComponent', () => {
  let component: UnirseSalaInvitadoComponent;
  let fixture: ComponentFixture<UnirseSalaInvitadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnirseSalaInvitadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnirseSalaInvitadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
