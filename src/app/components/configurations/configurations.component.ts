import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2'
import { ProcesosService } from '../dashboard/procesos/procesos-services/procesos.service';
import { EstudiantesService } from '../dashboard/estudiantes/services/estudiantes.service';
import { TokenService } from '../shared/services-shared/token.service';
import { ConfigurationServicesService } from './services/configuration-services.service';

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
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  @ViewChild('grupoNombre', { static: false })
  grupoNombreInput!: HTMLInputElement;
  _opacity: number = 0;

  public _explain: string = '';
  public codCia = environment.codCia;
  // public _create_show: boolean = true;
  public configurationForm = new FormGroup({
    inscripAutom:  new FormControl( false, [ Validators.required ]),
    nomproceso:  new FormControl( '', [ Validators.required ]),
    procesosSele:  new FormControl( '', [ Validators.required ]),
    grupo:  new FormControl( '', [ Validators.required ]),
    fechaInicio: new FormControl( new Date() ),
    fechaHasta: new FormControl( new Date() )
  });

  constructor(public conf: ConfigurationServicesService, public proceso: ProcesosService, public token: TokenService,  private alumnos: EstudiantesService,) { }

  ngOnInit(): void {
    this.validationProcess();
    this.obtenerConfiguracionesVinculacion();
  }

  validationProcess() {
    let x = this.configurationForm.controls['inscripAutom'].value;
    switch(x) {
      case true:
        this._explain= 'Los alumnos se registran al proceso que tu indiques por lo que tendrás que elegir el proceso, también se les'+
                       ' asignará un grupo automáticamente que podrás editar más adelante en módulo de crear grupos.';        
        // this._create_show = true;
        this.obtenerProcesosCreados();
        this._opacity = 1;
        // this._create_show = false;
        break;
      case false:
        this._explain= 'Los alumnos se registran de manera general al proceso de vinculación de manera automática. '+
                       'En espera que sean asignados a un grupo, proyecto y un proceso correspondiente manualmente'+
                       'Y el administrador crea los grupos de manera manual con la lista de alumnos que se generaran una vez ingresen.';
        // this._create_show = false;
        this.listaProcesos = [];
        this._opacity      = 0.3;
        // this._create_show  = true;
        this.configurationForm.controls['grupo'].setValue('');
        break;
      }
    }
    
    
  onSubmit() {
    this.guardarConfigVinculacionProceso()
  }
    
  listaGrupoAdd: any = [];
  public confVin: any = [];
  guardarConfigVinculacionProceso() {
    // this.guardarGrupos();

    // if( this.configurationForm.controls['inscripAutom'].value ) {
    //     if( this.configurationForm.controls['grupo'].value == '' || this.configurationForm.controls['grupo'].value == undefined ) 
    //     {
    //       Toast.fire({
    //         icon: 'warning',
    //         title: 'Nombre del grupo no se ha generado.',
    //         text: 'Verifica si has  elegido un proceso...',
    //         timer: 3000
    //       })
    //     } 
    //  }
    //   else if ( this.configurationForm.controls['fechaInicio'].value == '' || this.configurationForm.controls['fechaInicio'].value == null || this.configurationForm.controls['fechaInicio'].value == undefined )
    //   {
    //     Toast.fire({
    //       icon: 'warning',
    //       title: 'Necesitas una fecha inicial.',
    //       timer: 3000
    //     })
    //   }
    //   else if ( this.configurationForm.controls['fechaHasta'].value == '' || this.configurationForm.controls['fechaHasta'].value == null || this.configurationForm.controls['fechaHasta'].value == undefined )
    //   {
    //     Toast.fire({
    //       icon: 'warning',
    //       title: 'Necesitas una fecha inicial.',
    //       timer: 3000
    //     })
    //   }
    
    // else {

      let anio = new Date();
      let codec: any;
      if (this.configurationForm.controls['inscripAutom'].value == true) codec = 'GRU-'+this.token.generateRandomString(5)+ '-' + anio.getFullYear();
      else  codec = '--';

      let x: any = sessionStorage.getItem('UserCod');

      this.confVin = {
        "inscriVin":     this.configurationForm.controls['inscripAutom'].value,
        "nombreInscrip": this.configurationForm.controls['nomproceso'].value,
        "codGrupo":      codec,
        "fechaInicio":   this.configurationForm.controls['fechaInicio'].value,
        "fechaFin":      this.configurationForm.controls['fechaHasta'].value,
        "codcia":        this.codCia,
        "codAdmin":      x,
        "codProceso":    this.idProceso
      }

      this.listaGrupoAdd = {
        codGrupo: codec,
        nombreGrupo: this.configurationForm.controls['grupo'].value,
        idEstudiante: '',
        codCia: this.codCia,
        fecCrea: new Date()
      }

      console.warn(this.confVin);

      this.conf.guardarConfigVinculacion(this.confVin).subscribe({
        next: (x) => {
          Toast.fire({
            icon: 'success',
            title: 'Configuración guardada exitosamente'
          })
        },
        error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'Configuración no se ha podido guardar'
          })
        },
        complete: () => {
          if( this.configurationForm.controls['inscripAutom'].value == true ) {
          this.alumnos.guardarGrupo(this.listaGrupoAdd).subscribe({
            next: (x) => {
              Toast.fire({
                icon: 'success',
                title: 'Grupo generado exitosamente'
              })
            }, error: (e) => {
              Toast.fire({
                icon: 'error',
                title: 'Algo ha ocurrido con el grupo'
              })
              console.error(e)
            }
          })
        }
        this.obtenerConfiguracionesVinculacion()
        this.clean();
      
      }
      })
    // }
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
      },
      error: (e) => {
        console.error(e);
      }
    })
  }

  clean() {
    this.configurationForm.controls['inscripAutom'].setValue('');
    this.configurationForm.controls['nomproceso'].setValue('');
    this.configurationForm.controls['procesosSele'].setValue('');
    this.configurationForm.controls['grupo'].setValue('');
    this.configurationForm.controls['fechaInicio'].setValue(new Date());
    this.configurationForm.controls['fechaHasta'].setValue(new Date());
  }

  updateVinculacionConf() {

  }

  
  public idProceso: string = '';
  crearGrupop() {
    
    let x = this.configurationForm.controls['procesosSele'].value;

    this.listaProcesos.find( (element:any) => {
      if( element.numeroProceso == x ) {
        this.idProceso = element.idProcesos;
        // console.warn(element);
        console.warn(this.idProceso);
      }
    })

    this.configurationForm.controls['grupo'].setValue('GRUPO-'+x);

  }

  public listaProcesos: any = []
  obtenerProcesosCreados() {
    this.proceso.obtenerProcesos(this.codCia).subscribe({
      next: (processCre) => {
        this.listaProcesos = processCre;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.log('Procesos Creados');
        console.log(this.listaProcesos);
      }
    })
  }

}
