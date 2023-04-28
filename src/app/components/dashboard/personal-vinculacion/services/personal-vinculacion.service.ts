import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PersonalVinculacionService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  guardarPersonalVinculacion( model: any [] ) {
    return this.http.post( this.url + 'PersonalVinculacion/guardarPersonalVinculacion', model );
  }

  obtenerPersonal( tipo: string, codecUser: string, codcia: string ) {
    return this.http.get( this.url + 'PersonalVinculacion/obtenerPersonal/' + tipo + '/' + codecUser + '/' + codcia );
  }

  // obtenerPersonal/alumno/AL-L-OFhx-0927031732/UG-2023-Vinc

  actualizarPersonal( codecUser: string, model: any [] ) {
    return this.http.put( this.url + 'PersonalVinculacion/editarPersonal/' + codecUser, model )
  }
  
  obtenerPersonalVinculacion(ccia: string) {
    return this.http.get( this.url + 'PersonalVinculacion/obtenerPersonalVinculacionGeneral/' + ccia );
  }
 
} 
