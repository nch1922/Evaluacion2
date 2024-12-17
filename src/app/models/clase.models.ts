export interface Clase {
  id?: string;
  nombre: string;
  profesor_id: string;
  codigo_qr: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  horario: {
    dia: string;
    horaInicio: string;
    horaFin: string;
  };
  alumnos_inscritos: string[];
  alumnos_presentes: string[];
}