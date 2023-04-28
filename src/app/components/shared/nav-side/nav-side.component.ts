import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedServicesService } from '../services-shared/shared-services.service';
import Swal from 'sweetalert2'
import { LoginService } from '../../login/services/login.service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-nav-side',
  templateUrl: './nav-side.component.html',
  styleUrls: ['./nav-side.component.scss']
})
export class NavSideComponent implements OnInit {

  public modulosLista: any        = [];
  public _username:    any        = '';
  public _IMGE:        string     = '';
  public codUser:      any        = '';
  _tipo_persona:       string     = '';

  // Área de trabajo, accede al menú...
  moduleLocation: string = '';

  @Output() modulo: EventEmitter<string> = new EventEmitter<string>();

  constructor( public Shared: SharedServicesService, private validate: LoginService ) { }

  ngOnInit(): void {
    this.getModulos();
    console.log(this.modulo)
  }
  
  public imagenLista: any = [];
  obtenerImagen(codUser: string) {
    this.Shared.obtenerImagen(codUser, 'PERFIL').subscribe( {
      next: (imagen) => {
        this.imagenLista = imagen;
        console.warn(this.imagenLista);
        this._IMGE = this.imagenLista[0].imagenContent;   
        console.warn(this._IMGE);
      }
    })
  }

  getModulos() {
    
    this._username = sessionStorage.getItem('UserName')?.toUpperCase();
    this.codUser = sessionStorage.getItem('UserCod');
    this.Shared.getModulos( this.codUser ).subscribe(
      {
        next: (modulos) => {
          this.modulosLista = modulos;
        },
        error: () => {

        },
        complete: () => {
          console.log(this.modulosLista);
          this.getUser(this.codUser);
          this.obtenerImagen(this.codUser); 
        }
      }
    )
  }

  botonClick(nameModule: string) {
    console.log('Desde navside: ' + nameModule)
    this.modulo.emit(nameModule)
  }

  getUser(user: string) {
    this.Shared.getUser(user).subscribe( x => {
      console.log(x)
    })
  }

  closeSession() {
    this.validate.closeSession();
  }

}
