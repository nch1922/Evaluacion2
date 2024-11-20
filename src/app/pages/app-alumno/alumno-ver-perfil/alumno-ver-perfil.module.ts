import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlumnoVerPerfilPageRoutingModule } from './alumno-ver-perfil-routing.module';

import { AlumnoVerPerfilPage } from './alumno-ver-perfil.page';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlumnoVerPerfilPageRoutingModule,
    TranslateModule.forChild(
      {
        loader : {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    )
  ],
  declarations: [AlumnoVerPerfilPage]
})
export class AlumnoVerPerfilPageModule {}
