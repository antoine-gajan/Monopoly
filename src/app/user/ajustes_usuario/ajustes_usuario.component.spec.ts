import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesUsuarioComponent } from './ajustes_usuario.component';

describe('ProfileComponent', () => {
  let component: AjustesUsuarioComponent;
  let fixture: ComponentFixture<AjustesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjustesUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
