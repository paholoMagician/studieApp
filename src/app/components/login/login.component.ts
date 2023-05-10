import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';


import Swal from 'sweetalert2'
import { RegistroAlumnoService } from '../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { ConfigurationServicesService } from '../configurations/services/configuration-services.service';
import { environment } from 'src/environments/environment.prod';

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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public codCia = environment.codCia;
  hide = true;

  public loginForm = new FormGroup({
    email:    new FormControl(''),
    password: new FormControl('')
  });

  public user: any = [];
  constructor( private login: LoginService, public router: Router,
    public conf: ConfigurationServicesService, ) { }

  ngOnInit(): void {
    this.login.validate();
    this.obtenerConfiguracionesVinculacion();
  }

  onSubmit() {
    this.login.login(this.loginForm.value).subscribe({
      next: (x) => {
        this.user = x;
        console.warn(this.user)
        Toast.fire({
          icon: 'success',
          title: 'Te has logeado con éxito'
        })
      }, error: (error) => {
        Toast.fire({
          icon: 'error',
          title: 'Error en los datos de ingreso'
        })
        console.error(error)
      }, complete: () => {
        sessionStorage.setItem('cedula', this.user.username);
        sessionStorage.setItem('UserCod',  this.user.userCod);
        sessionStorage.setItem('email',    this.user.email);
        sessionStorage.setItem('tipo',     this.user.tipo);
        sessionStorage.setItem('UserName',     this.user.nombreEntidad);
        this.login.validate();
      }
    }
    )
  }

  registrar(data: any){

    /**------------------------------- */
    /**VALIDACION */
    /**------------------------------- */
    localStorage.setItem('cod_processs_register',data.cod_proceso);
    localStorage.setItem('cod_group_register',data.cod_grupo);
    this.router.navigate(['/Registro'])

  }

  lisConfVinc: any = [];
  _cantidad_procesos_act: number = 0;
  obtenerConfiguracionesVinculacion() {
    this.conf.obtenerConfVinc(this.codCia).subscribe({
      next: (confs) => {
        this.lisConfVinc = confs;
        console.log('CONFIGURACIONES')
        console.log(this.lisConfVinc)
        this._cantidad_procesos_act = this.lisConfVinc.length;
        // this.inscripciones = this.lisConfVinc.nombre_inscrip;
        
      },
      error: (e) => {
        console.error(e);
      }
    })
  }



}
