import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'alumno-inicio',
    loadChildren: () => import('./pages/app-alumno/alumno-inicio/alumno-inicio.module').then( m => m.AlumnoInicioPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'alumno-ver-perfil',
    loadChildren: () => import('./pages/app-alumno/alumno-ver-perfil/alumno-ver-perfil.module').then( m => m.AlumnoVerPerfilPageModule)
  },
  {
    path: 'alumno-historial-asistencia',
    loadChildren: () => import('./pages/app-alumno/alumno-historial-asistencia/alumno-historial-asistencia.module').then( m => m.AlumnoHistorialAsistenciaPageModule)
  },
  {
    path: 'profesor-ver-historial',
    loadChildren: () => import('./pages/app-profesor/profesor-ver-historial/profesor-ver-historial.module').then( m => m.ProfesorVerHistorialPageModule)
  },
  {
    path: 'profesor-ver-perfil',
    loadChildren: () => import('./pages/app-profesor/profesor-ver-perfil/profesor-ver-perfil.module').then( m => m.ProfesorVerPerfilPageModule)
  },
  {
    path: 'profesor-inicio',
    loadChildren: () => import('./pages/app-profesor/profesor-inicio/profesor-inicio.module').then( m => m.ProfesorInicioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
