import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorVerHistorialPage } from './profesor-ver-historial.page';

describe('ProfesorVerHistorialPage', () => {
  let component: ProfesorVerHistorialPage;
  let fixture: ComponentFixture<ProfesorVerHistorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorVerHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
