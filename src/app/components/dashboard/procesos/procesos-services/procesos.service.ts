import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProcesosService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  guardarProcesos( model: any [] ) {
    return this.http.post( this.url + 'Procesos/guardarProcesos', model );
  }

  obtenerProcesos( ccia: string ) {
    return this.http.get( this.url + 'Procesos/obtenerProcesos/' + ccia )
  }

  guardarGrupoAlumno( model: any [] ) {
    return this.http.post( this.url + 'GrupoAlumnos/guardarGrupoAlumno', model );
  }

  editarProcesosAlumno( codProceso: string, model: any [] ) {
    return this.http.put( this.url + 'Procesos/editarProceso/' + codProceso, model );
  }

  obtenerGrupoAlumno() {

  }

  eliminarProceso(idProceso: string, ccia: string) {
    return this.http.get( this.url + 'Procesos/eliminarProceso/' + idProceso + '/' + ccia )
  }

  borrarGrupoAlumno( codEstudiante: string ) {

  }

  editarGurupoAlumno( codGrupo: string ) {

  }

}
