import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GenerarActividadService {

  public url = environment.developerModeUrl
  constructor( private http: HttpClient, public router: Router ) { }

  guardarActividad( model: any [] ) {
    return this.http.post( this.url + 'RegistroActividad/guardarRegistroActividad', model )
  }  

  borrarActividad(id:string) {
    return this.http.get( this.url + 'RegistroActividad/ObtenerAlumnosGrupoRegistros/' + id );
  }


  ObtenerAlumnosGrupoRegistros( idAlumno:string, codcia: string ) {
    return this.http.get( this.url + 'RegistroActividad/ObtenerAlumnosGrupoRegistros/' + idAlumno + '/'+ codcia );
  }

  ObtenerRegistroActividades(cuser: string, ccia: string) {
    return this.http.get( this.url + 'RegistroActividad/ObtenerRegistrosdeActividades/' + cuser + '/' + ccia )
  }


}
