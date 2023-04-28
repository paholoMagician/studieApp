import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariosService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }

  guardarBeneficiario(model: any []) {
    return this.http.post( this.url + 'Beneficiarios/guardarBeneficiarios', model )
  }

  getProcesos(ccia: string, idProyecto: string) {
    return this.http.get( this.url + 'Beneficiarios/ObtenerProcesosPorProyectos/' + ccia + '/' + idProyecto );
  }

  obtenerBeneficiarios( ccia: string ) {
    return this.http.get( this.url + 'Beneficiarios/ObtenerBeneficiarios/' + ccia );
  }

  actualizarBeneficiario( idBeneficiario: string, model: any [] ) {
    return this.http.put( this.url + 'Beneficiarios/EditarBeneficiario/' + idBeneficiario, model )
  }

  eliminarBeneficiario( idBeneficiario: string ) {
    return this.http.delete( this.url + 'Beneficiarios/BorrarBeneficiarios/' + idBeneficiario )
  }

}
