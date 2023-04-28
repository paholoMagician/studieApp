import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class ProyectosService {
  
  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  guardarProyecto(model: any []) {
    return this.http.post( this.url + 'GenerarProyectos/guardarProyecto', model )
  }

  obtenerPersonalViculacio( codcia: string ) {
    return this.http.get( this.url + 'GenerarProyectos/obtenerGestoresProyectos/' + codcia )
  }

  obtenerProyectos(ccia: string) {
    return this.http.get( this.url + 'GenerarProyectos/obtenerProyectos/' + ccia );
  }

  actualizarProyectos( model: any [], idProyecto: string ) {
    return this.http.put( this.url + 'GenerarProyectos/EditarProyecto/' + idProyecto, model )
  }

}
