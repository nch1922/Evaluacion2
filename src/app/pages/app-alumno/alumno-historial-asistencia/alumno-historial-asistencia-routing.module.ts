import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlumnoHistorialAsistenciaPage } from './alumno-historial-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: AlumnoHistorialAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnoHistorialAsistenciaPageRoutingModule {}
