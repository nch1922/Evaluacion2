import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async resetPassword() {
    // Show loading
    const loading = await this.loadingController.create({
      message: 'Procesando...',
    });
    await loading.present();

    if (this.resetForm.valid) {
      try {
        const email = this.resetForm.value.email;
        await this.firebaseService.resetPassword(email);
        
        // Dismiss loading
        await loading.dismiss();

        // Show success alert
        const alert = await this.alertController.create({
          header: 'Restablecer Contraseña',
          message: 'Se ha enviado un correo de restablecimiento de contraseña. Revisa tu bandeja de entrada.',
          buttons: [{
            text: 'Aceptar',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }]
        });
        await alert.present();

        // Reset form
        this.resetForm.reset();
      } catch (error) {
        // Dismiss loading
        await loading.dismiss();

        let errorMsg = 'Ha ocurrido un error al restablecer la contraseña';
        
        if (error.code === 'auth/user-not-found') {
          errorMsg = 'No se encontró un usuario con este correo electrónico';
        } else if (error.code === 'auth/invalid-email') {
          errorMsg = 'El correo electrónico no es válido';
        }

        // Show error alert
        const alert = await this.alertController.create({
          header: 'Error',
          message: errorMsg,
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    } else {
      // Dismiss loading
      await loading.dismiss();
    }
  }

  // Getter for easy access in template
  get emailInvalid(): boolean {
    const emailControl = this.resetForm.get('email');
    return emailControl.invalid && (emailControl.dirty || emailControl.touched);
  }
}