import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { AlertController, ToastController } from '@ionic/angular'; // Para mostrar alertas o notificaciones
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-alumno-ver-perfil',
  templateUrl: './alumno-ver-perfil.page.html',
  styleUrls: ['./alumno-ver-perfil.page.scss'],
})
export class AlumnoVerPerfilPage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  
  alumnoNombre: string ='';
  alumnoEmail: string ='';
  alumnoSeccion: string ='';
  alumnoCarrera: string ='';
  alumnoSemestre: string ='';

  actividadesRecientes: Array<{ fecha: string, descripcion: string }> = [
    { fecha: '2023-09-15', descripcion: 'Asistencia a Matemáticas' },
    { fecha: '2023-09-14', descripcion: 'Asistencia a Física' }
  ];

  constructor(
    private router: Router,
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private translate: TranslateService
  ){}


  ngOnInit() {
    this.cargarPerfil();
  }

  async cargarPerfil(){
    const userData = await this.firebaseService.obtenerUsuarioLogueado();
    
    this.alumnoNombre = userData["name"] || 'Nombre no disponible';
    this.alumnoEmail = userData["email"] || 'Correo no disponible';
    this.alumnoSeccion = userData["seccion"] || 'Sección no disponible';
    this.alumnoCarrera = userData["carrera"] || 'Carrera no disponible';
    this.alumnoSemestre = userData["semestre"] || 'Semestre no disponible';
  }

  async editarPerfil(){
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      inputs: [
        { name: 'nombre', type: 'text', value: this.alumnoNombre, placeholder: 'Nombre' },
        { name: 'email', type: 'email', value: this.alumnoEmail, placeholder: 'Correo' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.alumnoNombre = data.nombre;
            this.alumnoEmail = data.email;

            // Actualizar los datos en localStorage
            const usuarioActualizado = {
              nombre: this.alumnoNombre,
              email: this.alumnoEmail,
              seccion: this.alumnoSeccion,
              carrera: this.alumnoCarrera,
              semestre: this.alumnoSemestre
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
    this.translate.use('es');
    this.mostrarToast('Se cambio a español'); 
  }

  changeEnglish(){
    this.translate.use('en')
    this.mostrarToast('changed to English'); 
  }

}
