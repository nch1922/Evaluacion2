import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController, ToastController } from '@ionic/angular'; // Para mostrar alertas o notificaciones

interface Event {
  title: string;
  date: Date;
  type: 'class' | 'exam' | 'activity';
}

@Component({
  selector: 'app-alumno-inicio',
  templateUrl: './alumno-inicio.page.html',
  styleUrls: ['./alumno-inicio.page.scss'],
})
export class AlumnoInicioPage implements OnInit {
  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  


  userData: any = {};
  alumnoNombre: string;
  fechaActual: Date = new Date();

  // New events array
  proximosEventos: Event[] = [
    {
      title: 'Examen de Matemáticas',
      date: new Date(2024, 2, 15, 10, 0),
      type: 'exam'
    },
    {
      title: 'Taller de Programación',
      date: new Date(2024, 2, 16, 14, 30),
      type: 'activity'
    },
    {
      title: 'Clase de Inglés',
      date: new Date(2024, 2, 20),
      type: 'class'
    }
  ];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
  ) { }

  async ngOnInit() {
    this.proximosEventos.sort((a, b) => a.date.getTime() - b.date.getTime());

    try {
      const userData = await this.firebaseService.obtenerUsuarioLogueado();
      this.alumnoNombre =  userData["name"];
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.alumnoNombre = 'alumno';
    }
  }

  // Existing methods remain the same

  escanearQR(){}

  verHistorial(){
    this.router.navigate(['alumno-historial-asistencia']);
  }

  verPerfil(){
    this.router.navigate(['alumno-ver-perfil']);
  }

  cerrarSesion(){
    this.firebaseService.signOut(); 
    this.router.navigate(['/login']);
    this.mostrarToast('Sesión cerrada correctamente');
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
  changeSpanish(){
    this.translate.use('es')
  }

  changeEnglish(){
    this.translate.use('en')
  }
}
