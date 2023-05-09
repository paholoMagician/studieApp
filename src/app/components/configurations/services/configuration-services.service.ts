import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationServicesService {

  public url = environment.developerModeUrl;
  constructor( private http: HttpClient, public router: Router ) { }


  obtenerLandingConf( ccia: string ) {
    return this.http.get( this.url + 'landingConf/obtenerConfiguracionLanding/' + ccia );
  }

  guardarLandingConf( model: any [] ) {
    return this.http.post( this.url + 'landingConf/guardarLandingConf', model );
  }

  guardarConfigVinculacion( model: any [] ) {
    return this.http.post( this.url + 'conf/guardarConfiguracionConvenio', model );
  }

  editarConfigVinculacion(model: any [], id: number) {
    return this.http.put( this.url + 'conf/EditarConfiguracionConvenio/'+id, model )
  }

  obtenerConfVinc(codcia: string) {
    return this.http.get( this.url + 'conf/obtenerConfVinc/'+codcia );
  }

}
