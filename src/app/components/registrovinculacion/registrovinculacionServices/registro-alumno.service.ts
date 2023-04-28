import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RegistroAlumnoService {

  public url = environment.developerModeUrl
  constructor( private http: HttpClient, public router: Router ) { }


  getDataMaster(codigoMaster: string) {
    return this.http.get( this.url + 'Master/GetDataMaster/' + codigoMaster )
  }

  guardarAlumno( model: any [] ) {
    return this.http.post( this.url + 'AlumnoVinculacion/guardarAlumnosVinculacion', model );
  }

  editarAlumno( model: any [] ) {
    return this.http.post( this.url + 'AlumnoVinculacion/EditarAlumno', model );
  }

  createAccountAlumo(tipo: number, codAlumno: string) {
    return this.http.get( this.url + 'AlumnoVinculacion/CreateAccountProcess/' +tipo +'/'+ codAlumno );
  }

}
