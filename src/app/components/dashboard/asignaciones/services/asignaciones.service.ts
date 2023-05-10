import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient ) { }
  
  guardarAsignaciones( model: any [] ) {
    return this.http.post( this.url + 'AsignacionProyectos/guardarAsignProy', model );
  }

  obtenerAsignaciones() {
    return this.http.get( this.url + 'AsignacionProyectos/obtenerAsigProy' );
  }

  actualizarAsignaciones(id: number, model : any []) {
    return this.http.put( this.url + 'AsignacionProyectos/EditarAsignProy/' + id, model );
  }

  deleteAsignaciones( id: number ) {
    return this.http.get( this.url + 'AsignacionProyectos/deleteAsigProy/' + id );
  }
 
}
