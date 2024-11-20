import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  
  toastCtrl = inject(ToastController);
  loadingCtrl = inject(LoadingController);

  constructor() { }

  async presentToas(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  loading(){
    return this.loadingCtrl.create({ spinner: 'crescent'})
  }
}
