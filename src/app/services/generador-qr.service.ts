import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode'; 
import { User } from '../models/user.models';
import { Seccion } from '../models/seccion.models';
import { Clase } from '../models/clase.models';

@Injectable({
  providedIn: 'root'
})
export class GeneradorQrService {

  constructor() { }

  async generarCodigoQR(
    profesor: User, 
    seccion: Seccion, 
    clase: Clase
  ): Promise<string> {
    // Datos para el código QR
    const datosQR = {
    profesorId: profesor.uid,
      profesorNombre: `${profesor.name} ${profesor.lastName}`,
      seccionId: seccion.id,
      seccionNombre: seccion.nombre,
      claseId: clase.id,
      claseNombre: clase.nombre,
      fecha: new Date().toISOString(),
      timestamp: Date.now()
    };

    try {
      // Generar código QR como URL de datos
      console.log(datosQR);
      const codigoQR = await QRCode.toDataURL(JSON.stringify(datosQR), {
        errorCorrectionLevel: 'H',
        width: 300
      });
      
      return codigoQR;
    } catch (err) {
      console.error('Error generando código QR', err);
      throw err;
    }
  }

  validarCodigoQR(codigoQRString: string): boolean {
    try {
      const datosQR = JSON.parse(codigoQRString);
      
      // Validar tiempo de vigencia (por ejemplo, 15 minutos)
      const tiempoActual = Date.now();
      const tiempoTranscurrido = tiempoActual - datosQR.timestamp;
      
      return tiempoTranscurrido <= 15 * 60 * 1000; // 15 minutos
    } catch (error) {
      console.error('Error validando código QR2', error);
      return false;
    }
  }

  parsearCodigoQR(codigoQRString: string) {
    try {
      return JSON.parse(codigoQRString);
    } catch (error) {
      console.error('Error parseando código QR', error);
      return null;
    }
  }


}
