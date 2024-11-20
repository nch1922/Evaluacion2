import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlumnoInicioPage } from './alumno-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: AlumnoInicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnoInicioPageRoutingModule {}
