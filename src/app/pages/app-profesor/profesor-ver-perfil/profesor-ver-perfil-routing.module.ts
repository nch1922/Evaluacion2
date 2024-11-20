import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfesorVerPerfilPage } from './profesor-ver-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesorVerPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesorVerPerfilPageRoutingModule {}
