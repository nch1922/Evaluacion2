import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    email : new FormControl("",[Validators.required, Validators.email]),
    password : new FormControl("",[Validators.required])
  });
  

  constructor(
    private router: Router
  ) {  }


  ngOnInit() {
  }


  async ingresar() { 
    
    this.form.get('email').markAsTouched();
    this.form.get('password').markAsTouched();
  
    
    if (this.form.get('email').invalid && this.form.get('password').invalid) {
      this.utilsService.presentToas({
        message: 'Correo y contraseña son inválidos',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'warning-outline'
      });
      return;
    }
  
    if (this.form.get('email').invalid) {
      this.utilsService.presentToas({
        message: 'Por favor, ingrese un correo electrónico válido',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'mail-outline'
      });
      return;
    }
  
    if (this.form.get('password').invalid) {
      this.utilsService.presentToas({
        message: 'La contraseña debe tener al menos 6 caracteres',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
        icon: 'lock-closed-outline'
      });
      return;
    }
  
    try {
      const loading = await this.utilsService.loading();
      await loading.present();
  
      const resp = await this.firebaseService.singIn(this.form.value as User);
      
      const userData = await this.firebaseService.getUserData(resp.user.uid);
  
      switch(userData.tipo_usuario) {
        case 'alumno':
          this.router.navigate(["alumno-inicio"]);
          loading.dismiss();
          break;
        case 'profesor':
          this.router.navigate(["profesor-inicio"]);
          loading.dismiss();
          break;
        default:
          loading.dismiss();
          throw new Error('Tipo de usuario no reconocido');
          
      }
  
      this.utilsService.presentToas({
        message: 'Bienvenido '+ userData.name,
        duration: 1500,
        color: 'success',
        position: 'bottom', 
        icon: 'person-circle-outline'
      });
  
    } catch (error) {
      let errorMessage = 'Error de inicio de sesión';
      
      if (error.code) {
        switch(error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Correo electrónico no registrado';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Formato de correo electrónico inválido';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Cuenta deshabilitada';
            break;
          default:
            errorMessage = error.message || 'Error desconocido';
        }
      }
  
      this.utilsService.presentToas({
        message: errorMessage,
        duration: 3000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      });
  
    } finally {
      const loading = await this.utilsService.loading();
      loading.dismiss();
    }
  }

}
