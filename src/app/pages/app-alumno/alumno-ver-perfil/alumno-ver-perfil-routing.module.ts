import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlumnoVerPerfilPage } from './alumno-ver-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: AlumnoVerPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlumnoVerPerfilPageRoutingModule {}
