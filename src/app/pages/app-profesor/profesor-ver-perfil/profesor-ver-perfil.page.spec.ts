import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorVerPerfilPage } from './profesor-ver-perfil.page';

describe('ProfesorVerPerfilPage', () => {
  let component: ProfesorVerPerfilPage;
  let fixture: ComponentFixture<ProfesorVerPerfilPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorVerPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
