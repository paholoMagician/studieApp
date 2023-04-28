import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InstitutosService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  guardarInstituciones(model: any []) {
    return this.http.post( this.url + 'Instituciones/guardarInstitutos', model );
  }

  obtenerInstitutos(ccia: string) {
    return this.http.get( this.url + 'Instituciones/obtenerInstitutos/'+ ccia );
  }

  editarInstitutos(CodInstiProy: string, model: any []) {
    return this.http.put( this.url + 'Instituciones/actualizarInstitutos/'+ CodInstiProy, model );
  }

  eliminarInstitutos(CodInstiProy: string) {
    return this.http.get( this.url + 'Instituciones/EliminarInstitutos/'+ CodInstiProy );
  }


}
