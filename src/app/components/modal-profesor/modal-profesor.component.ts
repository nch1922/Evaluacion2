import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.models';
import { Seccion } from '../../models/seccion.models';
import { Clase } from '../../models/clase.models';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-profesor',
  templateUrl: './modal-profesor.component.html',
  styleUrls: ['./modal-profesor.component.scss'],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Seleccionar Clase</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label>Sección</ion-label>
          <ion-select [(ngModel)]="seccionSeleccionada">
            <ion-select-option 
              *ngFor="let seccion of secciones" 
              [value]="seccion">
              {{ seccion.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Clase</ion-label>
          <ion-select 
            [(ngModel)]="claseSeleccionada" 
            [disabled]="!seccionSeleccionada">
            <ion-select-option 
              *ngFor="let clase of seccionSeleccionada?.clases" 
              [value]="clase">
              {{ clase.nombre }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-button (click)="confirmar()">Confirmar</ion-button>
      </ion-list>
    </ion-content>
  `,
})
export class ModalProfesorComponent  implements OnInit {

  //@Input() secciones: Seccion[];
  seccionSeleccionada: Seccion | null = null;
  claseSeleccionada: Clase | null = null;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  confirmar() {
    if (this.seccionSeleccionada && this.claseSeleccionada) {
      this.modalController.dismiss({
        seccion: this.seccionSeleccionada,
        clase: this.claseSeleccionada
      });
    }
  }

}
