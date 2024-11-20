import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  form = new FormGroup({
    uid: new FormControl(""),
    name: new FormControl("",[Validators.required, Validators.minLength(4)]),
    lastName: new FormControl("",[Validators.required, Validators.minLength(4)]),
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("",[Validators.required, Validators.minLength(6)]),
    password2: new FormControl("",[Validators.required, Validators.minLength(6)]),
    tipo_usuario: new FormControl("",[Validators.required])
  })

  formularioRegistro : FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, public router: Router ) { 
    
  }


  ngOnInit() {
  }

  async registrarUsuario() {
    if (this.form.valid) {
      // Validar que las contraseñas coincidan
      if (this.form.value.password !== this.form.value.password2) {
        await this.mostrarAlerta('Error', 'Las contraseñas no coinciden');
        return;
      }

      try {
        const loading = await this.utilsService.loading();
        await loading.present();

        // Crear objeto de usuario sin password2
        const userData: User = {
          email: this.form.value.email,
          password: this.form.value.password,
          name: this.form.value.name,
          lastName: this.form.value.lastName,
          tipo_usuario: this.form.value.tipo_usuario,
          img: ''
        };

        const resp = await this.firebaseService.signUp(userData);

        if (resp && resp.user) {
          await this.mostrarAlerta('¡Éxito!', 'Usuario registrado correctamente');
          
          this.router.navigate(['login']);
          this.form.reset();
          loading.dismiss();
        }

      } catch (error) {
        console.error('Error en registro:', error);
        await this.mostrarMensajeError(error.code);
      }
    } else {
      await this.mostrarAlerta('Formulario Inválido', 'Por favor, complete todos los campos correctamente');
    }
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  private async mostrarMensajeError(errorCode: string) {
    let mensaje = 'Ha ocurrido un error en el registro';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        mensaje = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/invalid-email':
        mensaje = 'El correo electrónico no es válido';
        break;
      case 'auth/operation-not-allowed':
        mensaje = 'Operación no permitida';
        break;
      case 'auth/weak-password':
        mensaje = 'La contraseña es demasiado débil';
        break;
    }

    await this.mostrarAlerta('Error', mensaje);
  }

  // Getters para validaciones en el template
  get emailInvalido(): boolean {
    return this.form.get('email').invalid && this.form.get('email').touched;
  }

  get passwordInvalido(): boolean {
    return this.form.get('password').invalid && this.form.get('password').touched;
  }

  get nombreInvalido(): boolean {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  get apellidoInvalido(): boolean {
    return this.form.get('lastName').invalid && this.form.get('lastName').touched;
  }
  
  //-----------------------------------------------------------//
  async guardar2(){ 
    console.log("entro a la funcion");
    if(this.form.valid){
      console.log("dentro del if");
      const loading = await this.utilsService.loading();
      await loading.present();
      this.firebaseService.signUp(this.form.value as User)
        .then(async resp =>{
          console.log("guardando usuario");
          await this.firebaseService.updateUser(this.form.value.name)
          
          let uid = resp.user.uid;
          this.form.controls.uid.setValue(uid)
          //funcion del seteo
          this.setUserInfo(uid);

        }).catch(error => {
          console.log(error);
        }).finally(()=>{
          loading.dismiss();
        })
      
    }
  }

  async setUserInfo(uid: string ){
    if(this.form.valid){
      const loading = await this.utilsService.loading();
      await loading.present();
  
      let path=  `users/${uid}`;
      delete this.form.value.password;

      this.firebaseService.setDocument(path, this.form.value )
        .then(async resp =>{
          this.router.navigate(['login']);
          this.form.reset(); //se resetea el formulario
  
        }).catch(error => {
          console.log(error);
        }).finally(()=>{
          loading.dismiss();
        })
      
    }
  }
  

}
