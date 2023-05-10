import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment.prod';
import { ProyectosService } from '../generar-proyectos/services/proyectos.service';
import { BeneficiariosService } from '../registro-beneficiario/beneficiarios.service';
import { AsignacionesService } from './services/asignaciones.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';

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
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.scss']
})
export class AsignacionesComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  public dataSource!: MatTableDataSource<any>;

  public codCia = environment.codCia;
  _icon: string = 'add';
  buttonTitle: string = 'Crear';
  _cancel: boolean = false;
  _view_personal: boolean = true;
  columnHead: any = [ 'edit', 'nombreProyecto', 'numeroProceso', 'coordinadorGeneral', 'Contraparte', 'Instituto' ]; 

  panelOpenState = false;
  public asignProyForm = new FormGroup ({
    idProyecto: new FormControl('', [Validators.required]),
    idProcesos: new FormControl('', [Validators.required]),
    idCoordinadorGeneral: new FormControl('', [Validators.required]),
    idContraparte: new FormControl('', [Validators.required]),
  })


  limpiar() {
    this.asignProyForm.controls['idCoordinadorGeneral'].setValue('');   
    this.asignProyForm.controls['idContraparte'].setValue('');
    this.asignProyForm.controls['idProyecto'].setValue('');
    this.asignProyForm.controls['idProcesos'].setValue('');
    this._icon = 'add';
    this._cancel = false;
    this.buttonTitle = 'Crear';
  }

  onSubmitGrupo() {
    switch( this.buttonTitle ) {
      case 'Crear':
        this.guardarAsignaciones()
        break;
      case 'Actualizar':
        this.actualizarAsign()
        break;
    }
  }

  constructor(private proyecto:        ProyectosService,                
              private beneficiarios:   BeneficiariosService,
              private asign:           AsignacionesService ) { }

  ngOnInit(): void {
    this.obtenerProyectos();
    this.obtenerPersonal();
    this.obtenerAsignaciones();
  }

  public fechaFinalProyecto: any;
  obtenerFechaFinal() {
    this.listaProyectosObtenidas.filter((element:any) => {
      if(element.idProyecto == this.asignProyForm.controls['idProyecto'].value) {
        this.fechaFinalProyecto = element.ffin;
        console.log(this.fechaFinalProyecto);
      }
    })
  }

  public personalVinculacion: any = [];
  public contraparteLista: any = [];
  public personalLista: any = []
  obtenerPersonal() {
    this.proyecto.obtenerPersonalViculacio(this.codCia).subscribe({
      next: (personal) => {
        this.personalVinculacion = personal;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        
        this.personalVinculacion.filter( (element:any) => {
         if ( element.tipo == '004' ) {
            this.contraparteLista.push(element);
            console.log(this.contraparteLista); 
          }

          else if ( element.tipo != '004' && element.tipo != '005' ) {
            this.personalLista.push(element);
          }

        })

        // this.dataSource = new MatTableDataSource(this.personalVinculacion);        

      }
    })
  }

  listaProyectosObtenidas: any = [];
  obtenerProyectos() {
    this.proyecto.obtenerProyectos( this.codCia ).subscribe({
      next: (proyectos) => {
        this.listaProyectosObtenidas = proyectos;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {

      }
    })
  }

  public listaProcesos: any = [];
  public optionValue: string = '';

  obtenerProcesosPorProyectos() {

    console.warn(this.asignProyForm.controls['idProyecto'].value)

    this.beneficiarios.getProcesos(this.codCia, this.asignProyForm.controls['idProyecto'].value)
    .subscribe({
    next: (x) => {
        this.listaProcesos = x;
        console.log(this.listaProcesos);
      },
      error: (e) => {
        console.error(e)
      },
      complete: () => {
        // console.log(this.listaProcesos);
      }
    })
  }

  public listaAsignaciones: any = [];
  guardarAsignaciones() {

    if ( this.asignProyForm.controls['idProyecto'].value == undefined || this.asignProyForm.controls['idProyecto'].value == null || this.asignProyForm.controls['idProyecto'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos que asignes un proyecto' })
    else if ( this.asignProyForm.controls['idProcesos'].value == undefined || this.asignProyForm.controls['idProcesos'].value == null || this.asignProyForm.controls['idProcesos'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos que asignes un proceso' })
    else if ( this.asignProyForm.controls['idCoordinadorGeneral'].value == undefined || this.asignProyForm.controls['idCoordinadorGeneral'].value == null || this.asignProyForm.controls['idCoordinadorGeneral'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos al coordinador general para avanzar' })
    else if ( this.asignProyForm.controls['idContraparte'].value == undefined || this.asignProyForm.controls['idContraparte'].value == null || this.asignProyForm.controls['idContraparte'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos al contraparte para avanzar' })
    else {
    this.listaAsignaciones = {
      codCoordgeneral:  this.asignProyForm.controls['idCoordinadorGeneral'].value,   
      codContraparte:   this.asignProyForm.controls['idContraparte'].value,   
      codProy:          this.asignProyForm.controls['idProyecto'].value, 
      codProceso:       this.asignProyForm.controls['idProcesos'].value
    }

    this.asign.guardarAsignaciones(this.listaAsignaciones).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Asignación generada exitosasmente'
        })
      },
      error: (e) => {
        Toast.fire({
          icon: 'success',
          title: 'No hemos podido generar la asignación'
        })
      },
      complete: () => {
        this.obtenerAsignaciones();
        this.limpiar();
      }
    })
    }
  } 

  public asignList: any = [];
  obtenerAsignaciones() {
    this.asign.obtenerAsignaciones().subscribe({
      next:(x) => {
        this.asignList = x;
        console.warn(this.asignList);
      },
      error: (e) => {
        console.error(e);
      }, complete: () => {
        this.dataSource = new MatTableDataSource(this.asignList);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  public id: number = 0;
  catchDataGrupo(data: any) {
    this.asignProyForm.controls['idCoordinadorGeneral'].setValue(data.codCoordgeneral);
    this.asignProyForm.controls['idContraparte'].setValue(data.codContraparte);   
    this.asignProyForm.controls['idProyecto'].setValue(data.codProy); 
    this.obtenerProcesosPorProyectos();
    this.asignProyForm.controls['idProcesos'].setValue(data.codProceso);
    this._icon = 'sync_alt';
    this.buttonTitle = 'Actualizar';
    this._cancel = true;
    this.id = data.id
  }

  actualizarAsign() {

    if ( this.asignProyForm.controls['idProyecto'].value == undefined || this.asignProyForm.controls['idProyecto'].value == null || this.asignProyForm.controls['idProyecto'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos que asignes un proyecto' })
    else if ( this.asignProyForm.controls['idProcesos'].value == undefined || this.asignProyForm.controls['idProcesos'].value == null || this.asignProyForm.controls['idProcesos'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos que asignes un proceso' })
    else if ( this.asignProyForm.controls['idCoordinadorGeneral'].value == undefined || this.asignProyForm.controls['idCoordinadorGeneral'].value == null || this.asignProyForm.controls['idCoordinadorGeneral'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos al coordinador general para avanzar' })
    else if ( this.asignProyForm.controls['idContraparte'].value == undefined || this.asignProyForm.controls['idContraparte'].value == null || this.asignProyForm.controls['idContraparte'].value == '' ) Toast.fire({ icon: 'warning', title: 'Necesitamos al contraparte para avanzar' })
    else {
    this.listaAsignaciones = {
      id: this.id,
      codCoordgeneral:  this.asignProyForm.controls['idCoordinadorGeneral'].value,   
      codContraparte:   this.asignProyForm.controls['idContraparte'].value,   
      codProy:          this.asignProyForm.controls['idProyecto'].value, 
      codProceso:       this.asignProyForm.controls['idProcesos'].value
    }

    this.asign.actualizarAsignaciones(this.id, this.listaAsignaciones).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Asignación actualizada'
        })
      },
      error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'No hemos podido actualizar'
        })
      },
      complete: () => {
        this.obtenerAsignaciones();
        this.limpiar();
      }
    })
    }
  }


  eliminarAsignacion(id: number) {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta acción es irreversible y compromete otros procesos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.asign.deleteAsignaciones(id).subscribe({
          next: (x) => {
            Toast.fire({
              icon: 'success',
              title: 'Asignación eliminada'
            })
          }, error: (e) => {
            Toast.fire({
              icon: 'error',
              title: 'No hemos podido eliminar la asignacion'
            })
            console.error(e);
          },
          complete: () => {
            this.obtenerAsignaciones();
          }
        })
      }
    })
  }


}
