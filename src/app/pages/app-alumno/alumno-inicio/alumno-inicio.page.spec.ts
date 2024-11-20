import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnoInicioPage } from './alumno-inicio.page';

describe('AlumnoInicioPage', () => {
  let component: AlumnoInicioPage;
  let fixture: ComponentFixture<AlumnoInicioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoInicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
