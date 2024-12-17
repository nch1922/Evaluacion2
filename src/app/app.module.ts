import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

  //imports para firebase
import { initializeApp } from 'firebase/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

  //imports para generar el codigo qr






export const firebaseConfig = { //configuracion de firebase
  apiKey: "AIzaSyA80eZKUyiUUQP6Rh-CQfZMScWLB-SyVnw",
  authDomain: "registerapp-nch-axl.firebaseapp.com",
  projectId: "registerapp-nch-axl",
  storageBucket: "registerapp-nch-axl.appspot.com",
  messagingSenderId: "733329335179",
  appId: "1:733329335179:web:60dcda51254a26cd4f458e",
  measurementId: "G-RFH58YNB23"
};

initializeApp(firebaseConfig); //iniciar firebase

registerLocaleData(localeEs);

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json')
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: 'md' }), 
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader : {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
