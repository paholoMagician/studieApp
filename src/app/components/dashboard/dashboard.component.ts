import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { ConfigurationServicesService } from '../configurations/services/configuration-services.service';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  moduloEmitter: any;
  _usuario: boolean = false;
  _personal:boolean = false;
  _datos_personales:boolean = true;
  _registro_beneficiario:boolean = false;
  _registro_convenio: boolean = false;
  _generar_proyectos: boolean = false;
  _generar_procesos: boolean = false;
  _agrupar_estudiantes: boolean = false;
  _agregar_actividad: boolean = false;
  _generar_reportes: boolean = false;
  _instituciones_maestro: boolean = false;
  _configurations: boolean = false;
  _asignaciones: boolean = false;
  
  constructor( private login: LoginService,
               public router: Router ) { }

               public serverMessageList: any = []
               public icon: any = 'success';
               
  ngOnInit(): void {

    this.login.validate();
    this.valGrupo();



    let x: any = sessionStorage.getItem('UserCod');
    let cgrupo: any = sessionStorage.getItem('codGrupo');
    let tipo: any = sessionStorage.getItem('tipo');
    let title: string;


      if(cgrupo == undefined || cgrupo == null || cgrupo == '' ) {
        cgrupo = 'void';
        this.icon = 'warning'
        title = 'En proceso';
      }

      else {
        this.icon='success';
        title = 'Asignado';
      }

    

    this.login.validacionAsignacionProyectos(x, cgrupo).subscribe( x => {
      console.log(x);
      this.serverMessageList = x;
      if( tipo == 'estudiante' ) {    

        Swal.fire({
          icon: this.icon,
          title: title,
          text: this.serverMessageList[0].server_message
        })
        
      } 
    })

  }




  public grupoLista: any = [];
  valGrupo() {
    let x: any = sessionStorage.getItem('UserCod')
    this.login.grupoAlumnoValidacion(x).subscribe({
      next:(grupo) => {
        this.grupoLista = grupo;
        console.log(grupo)

        sessionStorage.setItem('codGrupo', this.grupoLista[0].codGrupo)
        // sessionStorage.setItem('nombreGrupo', this.grupoLista[0].nombreGrupo)

      }
    })
  }

  recibirModulo(modulo: string) {
    this.moduloEmitter = modulo;
    switch(this.moduloEmitter) {
      case 'Estudiante':
        this._usuario            = true;
        this._personal           = false;
        this._datos_personales   = false;
        this._registro_beneficiario   = false;
        this._registro_convenio   = false;
        this._generar_proyectos   = false;
        this._generar_procesos    = false;
        this._agrupar_estudiantes = false;
        this._agregar_actividad   = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Personal Vinculación':
        this._usuario            = false;
        this._personal           = true;
        this._datos_personales   = false;
        this._registro_beneficiario   = false;
        this._registro_convenio   = false;
        this._generar_proyectos   = false;
        this._generar_procesos    = false;
        this._agrupar_estudiantes = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Datos Personales':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = true;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Registro de Beneficiario':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._generar_proyectos       = false;
        this._registro_beneficiario   = true;
        this._registro_convenio       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Crear Convenios':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = true;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Crear Proyecto':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = true;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Crear Proceso':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = true;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Crear Grupos':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = true;
        this._agregar_actividad       = false;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Agregar Actividad':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = true;
        this._generar_reportes    = false;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Generar Reportes':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes    = true;
        this._instituciones_maestro    = false;
        this._configurations  = false;
        this._asignaciones  = false;
        break;
      case 'Instituciones':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes        = false;
        this._instituciones_maestro   = true;
        this._configurations          = false;
        this._asignaciones            = false;
        break;
      case 'Configuraciones':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes        = false;
        this._instituciones_maestro   = false;
        this._configurations          = true;
        this._asignaciones            = false;
        break;
      case 'Asignaciones':
        this._usuario                 = false;
        this._personal                = false;
        this._datos_personales        = false;
        this._registro_beneficiario   = false;
        this._registro_convenio       = false;
        this._generar_proyectos       = false;
        this._generar_procesos        = false;
        this._agrupar_estudiantes     = false;
        this._agregar_actividad       = false;
        this._generar_reportes        = false;
        this._instituciones_maestro   = false;
        this._configurations          = false;
        this._asignaciones            = true;
        break;
    }
  }  

}
