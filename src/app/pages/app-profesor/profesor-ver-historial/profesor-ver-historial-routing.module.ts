import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfesorVerHistorialPage } from './profesor-ver-historial.page';

const routes: Routes = [
  {
    path: '',
    component: ProfesorVerHistorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesorVerHistorialPageRoutingModule {}
