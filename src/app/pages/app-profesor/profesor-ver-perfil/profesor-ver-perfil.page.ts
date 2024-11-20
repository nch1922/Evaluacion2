import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular'; 
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profesor-ver-perfil',
  templateUrl: './profesor-ver-perfil.page.html',
  styleUrls: ['./profesor-ver-perfil.page.scss'],
})
export class ProfesorVerPerfilPage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  profesorNombre: string ;
  profesorEmail: string ;
  profesorArea: string ;
  profesorSemestre: string ;
  userData: any = {};

  actividadesRecientes: Array<{ fecha: string, descripcion: string }> = [
    { fecha: '2023-09-15', descripcion: 'Se realizo clases de matematica' },
    { fecha: '2023-09-14', descripcion: 'Se realizo clases de fisica' }
  ];

  constructor(
    private router: Router, 
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.cargarPerfil();
  }

  async cargarPerfil(){
    const userData = await this.firebaseService.obtenerUsuarioLogueado();

    this.profesorNombre = userData["name"] || 'Nombre no disponible';
    this.profesorEmail = userData["email"] || 'Correo no disponible';
    this.profesorArea = userData["area "]|| 'Area no disponible'
  }

  async editarPerfil(){
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      inputs: [
        { name: 'nombre', type: 'text', value: this.profesorNombre, placeholder: 'Nombre' },
        { name: 'email', type: 'email', value: this.profesorEmail, placeholder: 'Correo' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.profesorNombre = data.nombre;
            this.profesorEmail = data.email;

            // Actualizar los datos en localStorage
            const usuarioActualizado = {
              nombre: this.profesorNombre,
              email: this.profesorEmail,
            };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            this.mostrarToast('Perfil actualizado');
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  cerrarSesion(){
    this.firebaseService.signOut(); 
    this.router.navigate(['/login']);
    this.mostrarToast('Sesión cerrada correctamente');  
  }

  changeSpanish(){
    this.translate.use('es')
  }

  changeEnglish(){
    this.translate.use('en')
  }
}
