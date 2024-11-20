import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnoVerPerfilPage } from './alumno-ver-perfil.page';

describe('AlumnoVerPerfilPage', () => {
  let component: AlumnoVerPerfilPage;
  let fixture: ComponentFixture<AlumnoVerPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoVerPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
