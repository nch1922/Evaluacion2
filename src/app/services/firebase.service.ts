import { Injectable, inject } from '@angular/core';
import { getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
import {Seccion} from '../models/seccion.models';
import {Clase} from '../models/clase.models';
import {Asistencia} from '../models/asistencia.models';
import { doc, getFirestore, setDoc } from '@angular/fire/firestore';
import  firebase   from 'firebase/compat/app';
import { serverTimestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  
  getAuth(){ //obtener datosd e la base de datos
    return getAuth();
  }
  //inicio de sesion
  async signIn(user: User) {
    try {
      const credential = await this.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
      
      if (!credential.user) {
        throw new Error('No se pudo iniciar sesión');
      }
  
      // Verificar si el email está verificado
      if (!credential.user.emailVerified) {
        // Creamos un error personalizado
        const error = new Error('Email no verificado');
        error['code'] = 'auth/email-not-verified'; // Añadimos nuestro código personalizado
        throw error;
      }
      
      return credential;
    } catch (error) {
      console.error('Error en signIn:', error);
      throw error;
    }
  }

   // Registro de usuario
   async signUp(user: User) {
    try {
      // Crear usuario en Authentication
      const credential = await this.auth.createUserWithEmailAndPassword(
        user.email, 
        user.password
      );
      
      if (!credential.user) {
        throw new Error('No se pudo crear el usuario');
      }

      // Crear documento en Firestore
      const userData = {
        uid: credential.user.uid,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        tipo_usuario: user.tipo_usuario,
        img: user.img || ''
      };

      // Guardar en Firestore
      await this.firestore.collection('users').doc(credential.user.uid).set(userData);
      
      // Actualizar perfil
      await credential.user.updateProfile({
        displayName: user.name
      });

      return credential;

    } catch (error) {
      console.error('Error en signUp:', error);
      throw error;
    }
  }

  async updateUser(displayName: string) {
    const user = await this.auth.currentUser;
    if (user) {
      return user.updateProfile({ displayName });
    }
    throw new Error('No hay usuario autenticado');
  }

   // Establecer documento en Firestore
   setDocument(path: string, data: any) {
    const pathParts = path.split('/');
    const collection = pathParts[0];
    const docId = pathParts[1];
    
    return this.firestore.collection(collection).doc(docId).set(data);
  }

  getDocument(path: string) {
    const pathParts = path.split('/');
    const collection = pathParts[0];
    const docId = pathParts[1];
    
    return this.firestore.collection(collection).doc(docId).get();
  }

 
  async sendVerificationEmail(): Promise<void> {
    try {
      const user = await this.auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }
      await user.sendEmailVerification();
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      throw error;
    }
  }
  
  // Función para verificar si el email está verificado
  isEmailVerified(user: firebase.User | null): boolean {
    return user?.emailVerified ?? false;
  }

  // Restablecer contraseña
  resetPassword(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  // Cerrar sesión
  signOut() {
    return this.auth.signOut();
  }

  // Obtener datos del usuario logueado
  async obtenerUsuarioLogueado(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.auth.authState.subscribe(async (user) => {
        if (!user) {
          reject(new Error('No hay un usuario autenticado'));
          return;
        }

        // Consulta Firestore para obtener más información del usuario
        const doc = await this.firestore.collection('users').doc(user["uid"]).get().toPromise();
        if (!doc.exists) {
          reject(new Error('No se encontraron datos del usuario en Firestore'));
          return;
        }

        resolve(doc.data() as User); // Retorna los datos del usuario
      });
    });
  }

 
  async getUserData(uid: string): Promise<User> {
    const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
    return userDoc.data() as User; // Asegúrate de que 'User' coincide con el modelo
  }
  
  constructor() { }



  //Funciones para obtener las secciones y clases por profesor
  async obtenerSeccionesPorProfesor(profesorId: string) {
    try {
      // Verifica que el profesorId no esté vacío
      if (!profesorId) {
        console.log("Entra vacio");
        throw new Error('El ID del profesor no puede estar vacío');
        
      }
  
      // Referencia a la colección 'secciones' filtrando por 'profesorId'
      const seccionesRef = this.firestore.collection('seccion', ref => 
        ref.where('profesor_id', '==', profesorId)
      );
      console.log("seccionesRef:", seccionesRef);
  
      // Obtiene el snapshot de las secciones
      const seccionesSnapshot = await seccionesRef.get().toPromise();
  
      // Mapea los documentos a un formato más manejable
      return seccionesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Seccion) // Especificar el tipo explícitamente
      }));
    } catch (error) {
      console.error('Error al obtener secciones:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  } //Funciona

  //obterner clases por seccion
  async obtenerClasesDeSeccion(seccionId: string) {
    console.log("Buscando sección con ID:", seccionId);
    try {
      const seccionDoc = await this.firestore.collection('seccion').doc(seccionId).get().toPromise();
      console.log("seccionDoc", seccionDoc);
      if (!seccionDoc.exists) {
        console.error('No se encontró la sección con ID:', seccionId);
        return [];
      }
  
      const seccionData = seccionDoc.data() as Seccion;
      console.log("seccionData", seccionData);
  
      // Verifica que clase_ids sea un arreglo y no esté vacío
      if (!seccionData["clase_ids"] || !Array.isArray(seccionData["clase_ids"]) || seccionData["clase_ids"].length === 0) {
        return [];
      }
  
      // Obtener los detalles de cada clase
      const clasesPromises = seccionData["clase_ids"].map(claseId => 
        this.firestore.collection('clases').doc(claseId).get().toPromise()
      );
      console.log("clasesPromises:", clasesPromises);
  
      const clasesSnapshots = await Promise.all(clasesPromises);
      
      // Mapear los resultados a un formato más manejable
      return clasesSnapshots.map(claseDoc => ({
        id: claseDoc.id,
        ...(claseDoc.data() as Clase)
      }));
    } catch (error) {
      console.error('Error al obtener clases:', error);
      throw error;
    }
  }


  async obtenerSeccionesYClasesDelProfesor(profesorId: string) { //
    try {
      const secciones = await this.obtenerSeccionesPorProfesor(profesorId);
      console.log("secciones:", secciones);
      
      const seccionesConClases = await Promise.all(
        secciones.map(async (seccion) => {
          console.log("SeccionId:",seccion["id"] );
          const clases = await this.obtenerClasesDeSeccion(seccion["id"]);
          console.log("clases:", clases);
          return {
            ...seccion,
            clases
          };
        })
      );
      return seccionesConClases;
    } catch (error) {
      console.error('Error al obtener secciones y clases:', error);
      throw error;
    }
  }

  async registrarAsistencia(asistencia: Asistencia): Promise<void> {
    try {
      const asistenciaRef = this.firestore.collection('asistencias');
      await asistenciaRef.add(asistencia);
      console.log('Asistencia registrada:', asistencia);
    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      throw error; // Lanza el error para manejarlo en el componente si es necesario
    }
  }
  

}
