import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  public url = environment.developerModeUrl
  constructor( private http: HttpClient ) { }

  guardarEmpresa(model: any []) {
    return this.http.post( this.url + 'Instituto/guardarInstituto', model );
  }

  obtenerEmpresa() {
    return this.http.get( this.url + 'Instituto/obtenerInstituto' );
  }

  eliminarInstituto(codcia: string) {
    return this.http.get( this.url + 'Instituto/eliminarInstituto/' + codcia );
  }

  actualizarInstituto(codcia: string, model: any []) {
    return this.http.put( this.url + 'Instituto/actualizarInstituto/' + codcia, model );
  }

}
