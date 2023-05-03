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
  moduleName: boolean = true;
  _fontSize: string = '15pt';
  _width: string = '290px';
  _width_navside: string = '300px';
  _user: boolean = true;
  _icon: string = 'chevron_left';

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
    this.Shared.obtenerImagen(codUser, 'PERFIL').subscribe(
    {
      next: (imagen) => {
        this.imagenLista = imagen;
        console.warn(this.imagenLista);
        this._IMGE = this.imagenLista[0].imagenContent;   
        console.warn(this._IMGE);
      }
    }
    )
  }

  data: boolean = true;
  constrolNavside() {
    let x = document.getElementById('btnsplit') as HTMLDivElement;
    switch( this.data ) {
      case true:
        this.data = false;
        this.moduleName = false;
        this._fontSize = '20pt';
        this._width = '40px';
        this._width_navside = '100px';
        this._user = false; 
        this._icon = 'chevron_right';
        x.style.animationName = 'btnMoveLeft';
        x.style.transform = 'translate(-200px)'
        break;
      case false:
        this.data = true;
        this.moduleName = true;
        this._fontSize = '14pt';
        this._width = '';
        this._width_navside = '300px';
        this._user = true; 
        this._icon = 'chevron_left';
        x.style.animationName = 'btnMoveRight';
        x.style.transform = 'translate(0px)'
        break;
    }

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
