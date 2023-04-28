import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public url = environment.developerModeUrl

  constructor( private http: HttpClient, public router: Router ) { }

  eliminarEntidades(cuser: string) {
    return this.http.get( this.url + 'AlumnoVinculacion/EliminacionDeEntidadesProcesos/'+cuser )
  }

  getUsers() {
    this.http.get( this.url + 'User' )
  }
  
  validacionAsignacionProyectos( codUser: string, codGrupo: string ) {
    return this.http.get( this.url + 'GenerarProyectos/ValidacionAsignacionProyectos/'+codUser+'/'+codGrupo);
  }
  
  grupoAlumnoValidacion( codUser: string ) {
    return this.http.get( this.url + 'User/GetGrupoByUser/'+codUser);
  }

  login( model: any[] ) {
    return this.http.post( this.url + 'User/login', model )
  }

  validate() {
    let user: any = sessionStorage.getItem('UserCod');
    if( user == undefined || user == null || user == '' ) {
      this.router.navigate(['ingreso'])
    } else {
      this.router.navigate(['dashboard'])
    }
  }


  closeSession() {
    sessionStorage.removeItem('UserCod')
    sessionStorage.removeItem('UserName')
    sessionStorage.removeItem('cedula')
    sessionStorage.removeItem('tipo')
    sessionStorage.removeItem('imagen')
    sessionStorage.removeItem('email')
    this.validate()
  }

  

}
