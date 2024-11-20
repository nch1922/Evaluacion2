import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfesorVerPerfilPageRoutingModule } from './profesor-ver-perfil-routing.module';

import { ProfesorVerPerfilPage } from './profesor-ver-perfil.page';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfesorVerPerfilPageRoutingModule,
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
  declarations: [ProfesorVerPerfilPage]
})
export class ProfesorVerPerfilPageModule {}
