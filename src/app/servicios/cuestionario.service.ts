import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {

  constructor() { }

  // Método que devolverá todas las preguntas del cuestionario en un array
  public getPreguntas() { }

  // Recupera las preguntas de Storage. Si no hay ninguna almacenada, las lee del fichero
  public cargarDatos() { }

  // Lee los datos de un fichero y los almacena en un array
  private cargarFichero(nombreFichero) { }

  // Abre una alerta con el enunciado de la pregunta y comprueba la respuesta
  // En función de si es correcta o no, actualiza el valor del atributo "contestada"
  public async responder(pregunta) { }

  // Almacena el array de preguntas en Storage
  public guardar() {

  }
}
