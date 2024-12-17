import { Component, OnInit, inject,  ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController, ToastController } from '@ionic/angular'; // Para mostrar alertas o notificaciones
// para el lector de codigo qr
import { BrowserMultiFormatReader } from '@zxing/browser';
import { MultiFormatReader } from '@zxing/library'; 
import { Component as AngularComponent } from '@angular/core';
import { Camera, CameraPermissionType } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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
  
  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef;
  private codeReader = new BrowserMultiFormatReader();
  private scannerControls: any;
  private currentCamera: 'environment' | 'user' = 'environment';


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
    
  ) {
    this.codeReader = new BrowserMultiFormatReader();
   }

  async ngOnInit() {
    this.proximosEventos.sort((a, b) => a.date.getTime() - b.date.getTime());

    try {
      const userData = await this.firebaseService.obtenerUsuarioLogueado();
      this.alumnoNombre =  userData["name"];
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.alumnoNombre = 'alumno';
    }

    this.inicializarCamara();
    
  }

  async verificarPermisos() {
    // Solo verificar permisos en dispositivos móviles
    if (Capacitor.getPlatform() !== 'web') {
      const permissionStatus = await Camera.checkPermissions();
      
      if (permissionStatus.camera !== 'granted') {
        const requestResult = await Camera.requestPermissions();
        
        if (requestResult.camera !== 'granted') {
          // Manejar caso de permiso denegado
          console.error('Permiso de cámara denegado');
          return;
        }
      }
    }
    
    this.inicializarCamara();
  }

  async inicializarCamara() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length > 0) {
        // Usar la cámara actual (frontal o trasera)
        this.scannerControls = await this.codeReader.decodeFromVideoDevice(
          videoDevices.find(device => device.label.includes(this.currentCamera === 'environment' ? 'back' : 'front'))?.deviceId, 
          this.videoElement.nativeElement, 
          (result) => {
            if (result) {
              this.procesarCodigoQR(result.getText());
              this.detenerEscaneo();
            }
          }
        );
      } else {
        console.error('No se encontraron dispositivos de video');
      }
    } catch (error) {
      console.error('Error inicializando cámara', error);
    }
  }


  toggleCamera() {
    // Cambiar entre la cámara frontal y trasera
    this.currentCamera = this.currentCamera === 'environment' ? 'user' : 'environment';
    this.detenerEscaneo(); // Detener el escaneo actual
    this.inicializarCamara(); // Reiniciar la cámara con la nueva configuración
  }

  
  escanearQR() {
    this.inicializarCamara();
  }


  procesarCodigoQR(codigoQR: string) {
    console.log('Código QR escaneado:', codigoQR);
    this.mostrarToast('Se registro su asistencia correctamente en:' +  codigoQR);
  }


  detenerEscaneo() {
    if (this.scannerControls) {
      this.scannerControls.stop();
    }
  }

  // Limpiar recursos al salir
  ionViewWillLeave() {
    this.detenerEscaneo();
  }

  
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
