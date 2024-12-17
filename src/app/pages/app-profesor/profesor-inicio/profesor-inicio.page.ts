import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { GeneradorQrService } from 'src/app/services/generador-qr.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular'; 
import { User } from '../../../models/user.models';
import { Seccion } from '../../../models/seccion.models';
import { Clase } from '../../../models/clase.models';
import { ModalProfesorComponent } from 'src/app/components/modal-profesor/modal-profesor.component';
import * as QRCode from 'qrcode';


interface Event {
  title: string;
  date: Date;
  type: 'class' | 'meeting' | 'deadline';
}

@Component({
  selector: 'app-profesor-inicio',
  templateUrl: './profesor-inicio.page.html',
  styleUrls: ['./profesor-inicio.page.scss'],
  template: `
    <ngx-qrcode 
      [elementType]="'url'"
      [value]="qrData"
      [errorCorrectionLevel]="'M'">
    </ngx-qrcode>
  `
})
export class ProfesorInicioPage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  qrService = inject(GeneradorQrService);
   

  //datos para generar el codigo QR
  codigoQR: string = '';
  usuarioActual: User;
  seccionSeleccionada: Seccion | null = null;
  claseSeleccionada: Clase | null = null;
  
  ////////////////
  profesorNombre : string;
  fechaActual: Date = new Date();
  userData: any = {};
  
  
  
 secciones: { [key: string]: string[] } = {
    '001D': ['matematica', 'ingles', 'programacion'],
    '002E': ['contabilidad', 'herramientas tecnologicas'],
    '003F': ['matematica', 'herramientas tecnologicas']
  };

  // Nuevos eventos agregados
  proximosEventos: Event[] = [
    {
      title: 'Clase de Matemáticas - 001D',
      date: new Date(2024, 2, 15, 10, 0),
      type: 'class'
    },
    {
      title: 'Reunión de Coordinación',
      date: new Date(2024, 2, 16, 14, 30),
      type: 'meeting'
    },
    {
      title: 'Entrega de Calificaciones',
      date: new Date(2024, 2, 20),
      type: 'deadline'
    }
  ];

  asignaturasVisibles: { [key: string]: boolean } = {};
  asignaturaSeleccionada: string | null = null;
  //secciones: { [key: string]: string[] } = {};
  asignaturasSeleccionadas: { [seccion: string]: { [asignatura: string]: boolean } } = {};
  seccionesVisibles: Set<string> = new Set();
  checkboxBloqueado = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private alertCtrl: AlertController, 
    private toastCtrl: ToastController,
    private modalController: ModalController
  ) { }

  async ngOnInit() {
    try{
      //this.usuarioActual = this.firebaseService.obtenerUsuarioLogueado();
      console.log('Usuario logueado:', this.usuarioActual);
    }catch(error){
      console.error('Error:', error.message);
    }

    
    
    this.proximosEventos.sort((a, b) => a.date.getTime() - b.date.getTime());

    try {
      const userData = await this.firebaseService.obtenerUsuarioLogueado();
      this.profesorNombre =  userData["name"];
      //await this.cargarSeccionesYClases();
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.profesorNombre = 'Profesor';
    }

    
    
  }

//////////////// Funciones para generar codigo qr ////////////////////
 

async generarCodigoQR() {
  const seleccionadas = Object.entries(this.asignaturasSeleccionadas)
    .filter(([seccionKey, asignaturas]) => Object.values(asignaturas).some(selected => selected))
    .map(([seccionKey, asignaturas]) => {
      const asignaturasSeleccionadas = Object.keys(asignaturas).filter(asignatura => asignaturas[asignatura]);
      return { seccion: seccionKey, asignaturas: asignaturasSeleccionadas };
    });

  const data = JSON.stringify(seleccionadas);
  try {
    this.codigoQR = await QRCode.toDataURL(data);
  } catch (err) {
    console.error(err);
  }
}


limpiarCodigoQR() {
  this.codigoQR = null; // Limpia la variable del código QR
  console.log('Código QR limpiado.');
  this.mostrarToast('Código QR limpiado correctamente.'); // Muestra un mensaje de confirmación
}







//////////////////////////////////////////////////////////////

  // Alternar visibilidad de asignaturas por sección
  toggleAsignaturas(seccion: string) {
    if (this.seccionesVisibles.has(seccion)) {
      this.seccionesVisibles.delete(seccion);
    } else {
      this.seccionesVisibles.add(seccion);
    }
  }

   // Verificar si las asignaturas son visibles para una sección
   isAsignaturasVisible(seccion: string): boolean {
    return this.seccionesVisibles.has(seccion);
  }

  seleccionarAsignatura(asignatura: string) {
    this.asignaturaSeleccionada = asignatura;
    console.log('Asignatura seleccionada:', asignatura);
  }

  verPerfil(){
    this.router.navigate(['/profesor-ver-perfil']);
  }

  verHistorial(){
    this.router.navigate(['/profesor-ver-historial']);
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
  changeEnglish(){
    this.translate.use('en');
  }
  changeSpanish(){
    this.translate.use('es');
  }



  toggleCheckbox(seccion: string, asignatura: string) {
    // Alternar estado del checkbox
    if (!this.asignaturasSeleccionadas[seccion]) {
      this.asignaturasSeleccionadas[seccion] = {};
    }
    
    this.asignaturasSeleccionadas[seccion][asignatura] = 
      !this.asignaturasSeleccionadas[seccion][asignatura];
      this.generarCodigoQR();
  }



  //Cargar secciones y manejo deetas
  async cargarSeccionesYClases() {
    try {
      // Obtener el usuario actual
      const usuarioActual = await this.firebaseService.obtenerUsuarioLogueado();
      
      // Obtener secciones y clases del profesor
      const seccionesConClases = await this.firebaseService.obtenerSeccionesYClasesDelProfesor(usuarioActual.uid);
      console.log(seccionesConClases);
      // Procesar los datos para el formato requerido
      this.procesarSeccionesYClases(seccionesConClases);
    } catch (error) {
      console.error('Error al cargar secciones y clases', error);
      // Manejar el error (mostrar mensaje, etc.)
    }
  }

  procesarSeccionesYClases(seccionesConClases: any[]) {
    // Reiniciar estructuras
    this.secciones = {};
    this.asignaturasSeleccionadas = {};

    // Procesar cada sección
    seccionesConClases.forEach(seccion => {
      // Usar el ID de la sección como clave
      const seccionId = seccion.id;
      
      // Obtener nombres de clases
      const nombresClases = seccion.clases.map(clase => clase.nombre);
      
      // Guardar nombres de clases para esta sección
      this.secciones[seccionId] = nombresClases;
      
      // Inicializar estructura de asignaturas seleccionadas
      this.asignaturasSeleccionadas[seccionId] = {};
      
      // Inicializar todas las asignaturas como no seleccionadas
      nombresClases.forEach(asignatura => {
        this.asignaturasSeleccionadas[seccionId][asignatura] = false;
      });
    });
  }


}


