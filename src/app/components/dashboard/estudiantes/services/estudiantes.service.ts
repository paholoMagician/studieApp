import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  obtenerAlumnosVinculacion( codCia: string) {
    return this.http.get( this.url + 'AlumnoVinculacion/ObtenerAlumnos/' + codCia);
  }

  actualizarAlumnosVinculacion(codAlumno: string, model: any []) {
    return this.http.put( this.url + 'AlumnoVinculacion/EditarAlumno/' + codAlumno, model )
  }

  guardarGrupo( model: any [] ) {
    return this.http.post( this.url + 'GrupoAlumnos/guardarGrupoAlumno', model );
  }

  obtenerGrupoTipo( tipo:string, codGrupo: string, ccia: string ) {
    return this.http.get( this.url + 'GrupoAlumnos/ObtenerGrupo/' + tipo + '/' + codGrupo + '/' + ccia );
  }
  
  obtenerCursosEstudiantes( codcia: string ) {
    return this.http.get( this.url + 'GrupoAlumnos/ObtenerCantiddadAlumnosCurso/' + codcia );
  }
  
  obtenerGrupoEstudiantes( codcia: string ) {
    return this.http.get( this.url + 'GrupoAlumnos/ObtenerGruposEstudiantes/' + codcia );
  }

  eliminarEstudainteGrupo( codEstudiante: string ) {
    return this.http.get( this.url + 'GrupoAlumnos/borrarGrupoEstudiantes/' + codEstudiante );
  }

  obtenerAlunmnosSinGrupo( ccia: string ) {
    return this.http.get( this.url + 'GrupoAlumnos/ObtenerAlumnoSinGrupo/' + ccia );
  }

  eliminarGrupo(codGrupo: string) {
    return this.http.get( this.url + 'GrupoAlumnos/borrarGrupo/' + codGrupo );
  }

  actualizarGrupoEstudiantes( id: any, model: any [] ) {
    return this.http.put( this.url + 'GrupoAlumnos/EditarGrupo/' + id, model );
  }

}
