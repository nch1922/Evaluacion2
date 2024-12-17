export interface Seccion {
  id?: string;
  nombre: string;
  profesorId: string;
  claseIds: string[];
  periodo: string;
}