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

  
  private alertController: AlertController

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

    const loading = await this.utilsService.loading();
  
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
     
      await loading.present();
  
      const resp = await this.firebaseService.signIn(this.form.value as User);
      
      // Verificar si el email está verificado
      if (!resp.user.emailVerified) {
        loading.dismiss();
        
        // Mostrar alerta con opción para reenviar correo de verificación
        const alert = await this.alertController.create({
          header: 'Correo no verificado',
          message: 'Por favor, verifica tu correo electrónico para poder iniciar sesión. ¿Deseas que te enviemos un nuevo correo de verificación?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                this.firebaseService.signOut(); // Cerrar sesión ya que no está verificado
              }
            },
            {
              text: 'Reenviar correo',
              handler: async () => {
                try {
                  await this.firebaseService.sendVerificationEmail();
                  this.utilsService.presentToas({
                    message: 'Correo de verificación enviado. Por favor, revisa tu bandeja de entrada',
                    duration: 3000,
                    color: 'success',
                    position: 'bottom',
                    icon: 'mail-outline'
                  });
                } catch (error) {
                  this.utilsService.presentToas({
                    message: 'Error al enviar el correo de verificación',
                    duration: 3000,
                    color: 'danger',
                    position: 'bottom',
                    icon: 'alert-circle-outline'
                  });
                } finally {
                  await this.firebaseService.signOut(); // Cerrar sesión después de enviar el correo
                }
              }
            }
          ]
        });
        await alert.present();
        return;
      }
  
      // Si el email está verificado, continuar con el proceso normal
      const userData = await this.firebaseService.getUserData(resp.user.uid);
  
      switch(userData.tipo_usuario) {
        case 'alumno':
          this.router.navigate(["alumno-inicio"]);
          loading.dismiss();
          this.form.reset();
          break;
        case 'profesor':
          this.router.navigate(["profesor-inicio"]);
          loading.dismiss();
          this.form.reset();
          break;
        default:
          loading.dismiss();
          this.form.reset();
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
            loading.dismiss();
            break;
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            loading.dismiss();
            break;
          case 'auth/invalid-email':
            errorMessage = 'Formato de correo electrónico inválido';
            loading.dismiss();
            break;
          case 'auth/user-disabled':
            errorMessage = 'Cuenta deshabilitada';
            loading.dismiss();
            break;
          case 'auth/email-not-verified': //verifica si se verifiuco el correo
          errorMessage = 'Correo no verificado, por favor verifique su correo antes de iniciar sesion';
            loading.dismiss();
          break;
          default:
            errorMessage = error.message || 'Error desconocido';
            loading.dismiss();
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
