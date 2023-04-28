import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';


import Swal from 'sweetalert2'
import { RegistroAlumnoService } from '../registrovinculacion/registrovinculacionServices/registro-alumno.service';

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

  hide = true;

  public loginForm = new FormGroup({
    email:    new FormControl(''),
    password: new FormControl('')
  });

  public user: any = [];
  constructor( private login: LoginService, public router: Router ) { }

  ngOnInit(): void {
    this.login.validate();
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

  registrar(){

    /**------------------------------- */
    /**VALIDACION */
    /**------------------------------- */

    this.router.navigate(['/Registro'])

  }



}
