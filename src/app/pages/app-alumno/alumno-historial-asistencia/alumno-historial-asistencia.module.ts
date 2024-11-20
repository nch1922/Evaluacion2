import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlumnoHistorialAsistenciaPageRoutingModule } from './alumno-historial-asistencia-routing.module';

import { AlumnoHistorialAsistenciaPage } from './alumno-historial-asistencia.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnoHistorialAsistenciaPageRoutingModule,
    TranslateModule
  ],
  declarations: [AlumnoHistorialAsistenciaPage]
})
export class AlumnoHistorialAsistenciaPageModule {}
