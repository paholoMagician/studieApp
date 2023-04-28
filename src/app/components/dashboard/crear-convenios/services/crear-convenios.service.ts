import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CrearConveniosService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  guardarConvenioMacro( model: any [] ) {
    return this.http.post( this.url + 'Convenios/guardarConvenioMarco', model );
  }

  obtenerConveniosMarcos( ccia: string ) {
    return this.http.get( this.url + 'Convenios/obtnerConvenioMacro/' + ccia );
  }

  editarConvenioMarco(idConvenio: string, model: any []) {
    return this.http.put( this.url + 'Convenios/EditarConvenioMarco/' + idConvenio, model );
  }

  guardarConvenioEspecifico( model: any ) {
    return this.http.post( this.url + 'Especifico/guardarConvenioEspecifico', model );
  }

  editarConvenioEspecifico( codec: string, model: any ) {
    return this.http.put( this.url + 'Especifico/EditarConvenioEspecifico/' + codec, model );
  }
 
  obtenerConvenioEspecifico( codMarco:string ) {
    return this.http.get( this.url + 'Especifico/obtenerConvenioAdicional/' + codMarco );
  }

}
