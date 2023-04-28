import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SharedServicesService {


  public url = environment.developerModeUrl
  constructor( private http: HttpClient, public router: Router ) { }

  getModulos(userCod: string) {
    return this.http.get( this.url + 'ModulosAsignacion/GetModulos/' + userCod );
  }

  getDataMaster(codigoMaster: any) {
    return this.http.get( this.url + 'Master/GetDataMaster/' + codigoMaster )
  }

  getUser(userCod: string) {
    return this.http.get( this.url + 'User/GetModulos/' + userCod );
  }

  calcularEdad(fechaNacimiento: Date): number {
    const diffMillis = Date.now() - fechaNacimiento.getTime();
    const ageDate = new Date(diffMillis);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  validarCedula(cedula: string): boolean {

    if (cedula.length !== 10) {
      return false;
    }
    
    const digitoRegion = Number(cedula.substring(0, 2));
    if (digitoRegion < 1 || digitoRegion > 24) {
      return false;
    }
    
    const tercerDigito = Number(cedula.charAt(2));
    if (tercerDigito < 0 || tercerDigito > 6) {
      return false;
    }
    
    let suma = 0;
    let coeficiente = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    
    for (let i = 0; i < coeficiente.length; i++) {
      let multiplicacion = coeficiente[i] * Number(cedula.charAt(i));
      if (multiplicacion >= 10) {
        multiplicacion -= 9;
      }
      suma += multiplicacion;
    }
    
    const ultimoDigito = Number(cedula.charAt(9));
    const digitoverificador = (10 - (suma % 10)) % 10;
    
    return ultimoDigito === digitoverificador;
  
  }

  guardarImagen(model: any []) {
    return this.http.post( this.url + 'Imagen/guardarImagen', model );
  }

  guardarImagenActividad(model: any []) {
    return this.http.post( this.url + 'Imagen/guardarImagenActividad', model );
  }

  editarImagen(idimagen: string, model:any) {
    return this.http.put( this.url + 'Imagen/EditarImagen/' + idimagen, model );
  }

  obtenerImagen(cuser: string, tipo: string) {
    return this.http.get( this.url + 'Imagen/obtenerImagen/' + cuser + '/' + tipo );
  }

  obtenerImagenActividad(regActivida: string) {
    return this.http.get( this.url + 'Imagen/obtenerImagenActividad/' + regActivida );
  }

}
