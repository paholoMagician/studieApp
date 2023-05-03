import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public url = environment.developerModeUrl
  constructor( private http: HttpClient, public router: Router ) { }

  getCia() {
    return this.http.get(this.url + 'Instituto/obtenerInstituto');
  }

}
