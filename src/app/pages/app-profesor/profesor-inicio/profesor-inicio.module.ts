import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorInicioPageRoutingModule } from './profesor-inicio-routing.module';

import { ProfesorInicioPage } from './profesor-inicio.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorInicioPageRoutingModule,
    TranslateModule
  ],
  declarations: [ProfesorInicioPage]
})
export class ProfesorInicioPageModule {}
