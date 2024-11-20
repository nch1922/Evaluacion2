import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlumnoInicioPageRoutingModule } from './alumno-inicio-routing.module';

import { AlumnoInicioPage } from './alumno-inicio.page';

import {  TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnoInicioPageRoutingModule,
    TranslateModule
  ],
  declarations: [AlumnoInicioPage]
})
export class AlumnoInicioPageModule {}
