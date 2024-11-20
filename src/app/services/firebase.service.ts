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

  singIn(user: User){ //iniciar sesion 
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
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

  sendVerificationEmail() {
    return this.auth.currentUser.then(user => {
      return user?.sendEmailVerification();
    });
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
  async obtenerUsuarioLogueado() {
    const user = await this.auth.currentUser;
    if (!user) {
      throw new Error('No hay un usuario autenticado');
    }

    // Consulta Firestore para obtener más información del usuario
    const doc = await this.firestore.collection('users').doc(user.uid).get().toPromise();
    if (!doc.exists) {
      throw new Error('No se encontraron datos del usuario en Firestore');
    }

    return doc.data(); // Retorna los datos del usuario
  }

 
  async getUserData(uid: string): Promise<User> {
    const userDoc = await this.firestore.collection('users').doc(uid).get().toPromise();
    return userDoc.data() as User; // Asegúrate de que 'User' coincide con el modelo
  }
  
  constructor() { }
}
