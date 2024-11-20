import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnoHistorialAsistenciaPage } from './alumno-historial-asistencia.page';

describe('AlumnoHistorialAsistenciaPage', () => {
  let component: AlumnoHistorialAsistenciaPage;
  let fixture: ComponentFixture<AlumnoHistorialAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoHistorialAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
