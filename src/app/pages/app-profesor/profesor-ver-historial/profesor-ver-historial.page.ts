import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profesor-ver-historial',
  templateUrl: './profesor-ver-historial.page.html',
  styleUrls: ['./profesor-ver-historial.page.scss'],
})
export class ProfesorVerHistorialPage implements OnInit {

  sections: string[] = ['001D', '002E', '003F'];
  subjects: string[] = ['Matemáticas', 'Historia', 'Ciencias', 'Inglés'];
  
  selectedSection: string= "";
  selectedSubject: string= "";
  selectedDate: string= "";

  // Simulación de datos de asistencia
  attendanceRecords = [
    { date: '2024-09-01', section: '001D', subject: 'Matemáticas', studentName: 'Juan Pérez', present: true },
    { date: '2024-09-01', section: '001D', subject: 'Matemáticas', studentName: 'Ana López', present: false },
    { date: '2024-09-01', section: '002E', subject: 'Historia', studentName: 'Pedro Gómez', present: true },
    { date: '2024-09-01', section: '001D', subject: 'Ciencias', studentName: 'María Ruiz', present: false },
    { date: '2024-09-01', section: '003F', subject: 'Inglés', studentName: 'Laura Torres', present: true },
    { date: '2024-09-02', section: '001D', subject: 'Matemáticas', studentName: 'Juan Pérez', present: true },
    { date: '2024-09-02', section: '001D', subject: 'Matemáticas', studentName: 'Ana López', present: true },
  ];

  filteredAttendanceRecords: any[] = [];

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  onFiltersChange() {
    if (this.selectedDate) {
      const formattedDate = new Date(this.selectedDate).toISOString().split('T')[0];
      this.filteredAttendanceRecords = this.attendanceRecords.filter(record => 
        record.section === this.selectedSection && 
        record.subject === this.selectedSubject && 
        record.date === formattedDate
      );
    } else {
      this.filteredAttendanceRecords = [];
    }
  }

  changeSpanish(){
    this.translate.use('es')
  }

  changeEnglish(){
    this.translate.use('en')
  }
  
}
