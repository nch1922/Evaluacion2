import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorVerHistorialPageRoutingModule } from './profesor-ver-historial-routing.module';

import { ProfesorVerHistorialPage } from './profesor-ver-historial.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorVerHistorialPageRoutingModule,
    TranslateModule
  ],
  declarations: [ProfesorVerHistorialPage]
})
export class ProfesorVerHistorialPageModule {}
