import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alumno-historial-asistencia',
  templateUrl: './alumno-historial-asistencia.page.html',
  styleUrls: ['./alumno-historial-asistencia.page.scss'],
})
export class AlumnoHistorialAsistenciaPage implements OnInit {

  subjects: string[] = ['Matemáticas', 'Historia', 'Ciencias', 'Inglés'];
  selectedSubject: string="";

  // Simulación de datos de asistencia
  attendanceRecords = [
    { date: '2024-09-01', subject: 'Matemáticas', attended: true },
    { date: '2024-09-02', subject: 'Matemáticas', attended: false },
    { date: '2024-09-01', subject: 'Historia', attended: true },
    { date: '2024-09-02', subject: 'Ciencias', attended: true },
    { date: '2024-09-03', subject: 'Inglés', attended: false },
    { date: '2024-09-03', subject: 'Matemáticas', attended: true },
  ];

  filteredRecords: any[] = [];

  constructor(
    private translate: TranslateService
  ) {}

  ngOnInit() {
  }

  changeSpanish(){
    this.translate.use('es')
  }

  changeEnglish(){
    this.translate.use('en')
  }

  onSubjectChange() {
    this.filteredRecords = this.attendanceRecords.filter(record => record.subject === this.selectedSubject);
  }
}
