import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenService } from '../../shared/services-shared/token.service';
import { RegistroAlumnoService } from '../../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { EstudiantesService } from '../estudiantes/services/estudiantes.service';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalVinculacionService } from '../personal-vinculacion/services/personal-vinculacion.service';
import { environment } from 'src/environments/environment.prod';
import { ProyectosService } from '../generar-proyectos/services/proyectos.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalProcesosComponent } from './modal-procesos/modal-procesos.component';
import { ProcesosService } from './procesos-services/procesos.service';

import Swal from 'sweetalert2'
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
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  _cancel: boolean = false;
  icon_button: string = 'add';
  textButton: string = 'Crear';

  public codCia = environment.codCia;

  public alumnosLista:  any     =  [];
  public decanoLista: any       =  [];

  public dataSource!: MatTableDataSource<any>;
  columnHead: any = [ 'edit', 'Numero Proceso', 'horas', 'fecInicio', 'fecFin', 'nombreProyecto', 'Decano', 'Tutor', 'coordinadorGeneral', 'nombreGrupo' ];

  public procesosForm = new FormGroup({
    numeroProceso:                new FormControl( '', [ Validators.required ]),
    idDecanoVinculacion:          new FormControl( '', [ Validators.required ]),
    idProyecto:                   new FormControl( '', [ Validators.required ]),
    idTutorVinculacion:           new FormControl( '', [ Validators.required ]),
    idCoordinadorGeneral:         new FormControl( '', [ Validators.required ]),
    idAlumno:                     new FormControl( '', [ Validators.required ]),
    horas:                        new FormControl( '', [ Validators.required ]),
    fecInicio:                    new FormControl( '', [ Validators.required ]),
    fecFin:                       new FormControl( '', [ Validators.required ]),
  });

  constructor( public  token:           TokenService, 
               public dialog:           MatDialog,
               public proceso:          ProcesosService,
               public  registrarAlumno: RegistroAlumnoService,
               public  shared:          SharedServicesService,
               private alumnos:         EstudiantesService,
               public  personal:        PersonalVinculacionService,
               private proyecto:        ProyectosService, ) { }

  ngOnInit(): void {
    
    this.obtenerPersonal();
    this.getUsers();
    this.obtenerProcesosCreados();
    this.obtenerProyectos();

   }

  onSubmit() { 
    switch( this.textButton ) {
      case 'Crear':
        this.guardatProcesos();
        break;
      case 'Actualizar':
        this.editarProcesos();
        break;
    }
  }
  public fechaFinalProyecto: any;
  obtenerFechaFinal() {
    this.listaProyectosObtenidas.filter((element:any) => {
      if(element.idProyecto == this.procesosForm.controls['idProyecto'].value) {
        this.fechaFinalProyecto = element.ffin;
        console.log(this.fechaFinalProyecto);
      }
    })
  }

  validateDate() {
    let fechActual = new Date();
    let x =(fechActual.getDay()).toString().padStart(2,'0') + '-' + fechActual.getMonth().toString().padStart(2,'0') + '-' + fechActual.getFullYear();
    console.log(x)
    if( this.procesosForm.controls['fecFin'].value > this.fechaFinalProyecto ) {
      Swal.fire({
        icon:  'warning',
        title: 'Oops...',
        text:  'La fecha límite del proceso la delimita la del proyecto'
      })
      this.procesosForm.controls['fecFin'].setValue(x);
    }
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

  public inputsValidate: boolean = true;

  catchFile() { }

  limpiar() { 
    this.procesosForm.controls['numeroProceso']       .setValue('');
    this.procesosForm.controls['idDecanoVinculacion'] .setValue('');
    this.procesosForm.controls['idTutorVinculacion']  .setValue(''); 
    this.procesosForm.controls['idCoordinadorGeneral'].setValue('');
    this.procesosForm.controls['idAlumno']            .setValue('');
    this.procesosForm.controls['idProyecto']          .setValue('');
    this.procesosForm.controls['horas']               .setValue('');
    this._cancel = false;
    this.textButton = 'Crear';
    this.icon_button = 'add';
  }
  
  public codGrupo: string = '';
  openDialog() {

    const dialogRef = this.dialog.open( ModalProcesosComponent, {
      height: '550px',
      width: '50%',
      data: {
        codGrupo: '',
        nombreGrupo: ''
      }
    })

    dialogRef.afterClosed().subscribe( (result:any) => {      
      
      this.codGrupo = result.codGrupo;
      console.warn( result );
      console.warn( this.codGrupo );
      this.procesosForm.controls['idAlumno'].setValue(result.nombreGrupo)

    });

  }

  public idProcesos: string = '';
  editarProcesos() {
    this.procesos = {
      IdProcesos:           this.idProcesos,
      NumeroProceso:        this.procesosForm.controls['numeroProceso'].value,
      IdDecanoVinculacion:  this.procesosForm.controls['idDecanoVinculacion'].value,
      IdTutorVinculacion:   this.procesosForm.controls['idTutorVinculacion'].value, 
      IdCoordinadorGeneral: this.procesosForm.controls['idCoordinadorGeneral'].value,
      IdAlumno:             this.codGrupo,
      Idcia:                this.codCia,
      idProyecto:           this.procesosForm.controls['idProyecto'].value,
      horas:                this.procesosForm.controls['horas'].value,
      feccreaProceso:       new Date(),
      fecInicio:            this.procesosForm.controls['fecInicio'].value,
      fecFin:               this.procesosForm.controls['fecFin'].value
    }

    this.proceso.editarProcesosAlumno( this.idProcesos, this.procesos ).subscribe({
      next: ( proceso ) => {
        Toast.fire({
          icon: 'success',
          title: 'Proceso ha sido editado...'
        })
        
      },
      error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Proceso no se ha podido editar...'
        })
        console.error(e);
      },
      complete: () => {
        // this.obtenerProcesosCreados();

        // this.listaProcesos.filter( (element: any) => {
        
        //   element.decano  = this.procesosForm.controls['idDecanoVinculacion'].value;
        //   element.coordinadorGeneral = this.procesosForm.controls['idCoordinadorGeneral'].value;
        //   element.tutor = this.procesosForm.controls['idTutorVinculacion'].value;
        //   element.nombreGrupo = this.procesosForm.controls['idAlumno'].value;
        //   element.numeroProceso = this.procesosForm.controls['numeroProceso'].value;
        //   element.feccrea = new Date();

        // })

        // this.dataSource = new MatTableDataSource(this.listaProcesos);
        // this.dataSource.paginator = this.paginator;
        this.obtenerProcesosCreados();
        this.limpiar();
      }
    })

  }



  validacionHoras() {
    if (this.procesosForm.controls['horas'].value <= 0) {
      this.procesosForm.controls['horas'].setValue(0)
    }
  }

  public procesos: any = []
  guardatProcesos() {

    if (this.procesosForm.controls['numeroProceso'].value == '' || this.procesosForm.controls['numeroProceso'].value == null ) Toast.fire({ icon: 'warning', title: 'Número de proceso necesario...' });
    else if (this.procesosForm.controls['idDecanoVinculacion'].value == '' || this.procesosForm.controls['idDecanoVinculacion'].value == null ) Toast.fire({ icon: 'warning', title: 'Decano para la Vinculacion necesario...' });
    else if (this.procesosForm.controls['idTutorVinculacion'].value == '' || this.procesosForm.controls['idTutorVinculacion'].value == null ) Toast.fire({ icon: 'warning', title: 'Tutor para la Vinculacion necesario...' });
    else if (this.procesosForm.controls['idCoordinadorGeneral'].value == '' || this.procesosForm.controls['idCoordinadorGeneral'].value == null ) Toast.fire({ icon: 'warning', title: 'Coordinador General para la Vinculacion necesario...' });
    else if (this.procesosForm.controls['idProyecto'].value == '' || this.procesosForm.controls['idProyecto'].value == null ) Toast.fire({ icon: 'warning', title: 'Proyecto necesario...' });
    else if (this.procesosForm.controls['horas'].value <= 0 || this.procesosForm.controls['horas'].value == null ) Toast.fire({ icon: 'warning', title: 'Las horas no pueden ser 0 o menor a este...' });
    else {

    this.procesos = {
      IdProcesos:           'PROC-' + this.token.generateRandomString(10),
      NumeroProceso:        this.procesosForm.controls['numeroProceso'].value,
      IdDecanoVinculacion:  this.procesosForm.controls['idDecanoVinculacion'].value,
      IdTutorVinculacion:   this.procesosForm.controls['idTutorVinculacion'].value, 
      IdCoordinadorGeneral: this.procesosForm.controls['idCoordinadorGeneral'].value,
      IdAlumno:             this.codGrupo,
      Idcia:                this.codCia,
      IdProyecto:           this.procesosForm.controls['idProyecto'].value,
      horas:                this.procesosForm.controls['horas'].value,
      fecInicio:            this.procesosForm.controls['fecInicio'].value,
      fecFin:               this.procesosForm.controls['fecFin'].value
    }

    console.log('+++++++++++++++++++++++++++');
    console.log('this.procesos');
    console.log(this.procesos);
    console.log('+++++++++++++++++++++++++++');

    this.proceso.guardarProcesos(this.procesos).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Proceso ha sido generado...'
        })
      },
      error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'No hemos podido guardar este proceso...'
        })
      },
      complete: () => {
        this.obtenerProcesosCreados();
        this.limpiar();
      }
    })
    }
  } 


  public decano: string = '';
  public tutor: string = '';
  public coordinadorGeneral: string = '';

  catchData( finicio:Date, ffin: Date, horas: number, idGrupo: string, idProcesos: string, idProyecto: string, numeroProcesos: string, decano: string, tutor: string, coordinador: string, grupo: string ) {
    
    let inicio = finicio.toString().split('T');
    let fin    = ffin.toString().split('T');
    
    console.log(inicio[0])
    console.log(fin[0])

    this.procesosForm.controls['numeroProceso'].setValue(numeroProcesos);
    this.procesosForm.controls['idDecanoVinculacion'].setValue(decano);
    this.procesosForm.controls['idTutorVinculacion'].setValue(tutor);
    this.procesosForm.controls['idCoordinadorGeneral'].setValue(coordinador);
    this.procesosForm.controls['idAlumno'].setValue(grupo);
    this.procesosForm.controls['idProyecto'].setValue(idProyecto);
    this.procesosForm.controls['horas'].setValue(horas);
    this.procesosForm.controls['fecInicio'].setValue(inicio[0]);
    this.procesosForm.controls['fecFin'].setValue(fin[0]);
    this._cancel = true;
    this.textButton = 'Actualizar';
    this.icon_button = 'sync_alt';
    this.idProcesos = idProcesos;
    this.codGrupo = idGrupo;

    // this.decano = decanoNombre;
    // this.tutor = tutorNombre;
    // this.coordinadorGeneral = coordinadorNombre;

  }

  eliminarProceso( idProceso: string ) {
    this.proceso.eliminarProceso( idProceso, this.codCia ).subscribe( x => {
      Toast.fire({
        icon: 'success',
        title: 'Proceso ha sido generado...'
      })

      this.obtenerProcesosCreados();

    }, () => {
      Toast.fire({
        icon: 'error',
        title: 'Algo ha sucedido al eliminar el proceso...'
      })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public listaProcesos: any = []
  obtenerProcesosCreados(  )  {
    this.proceso.obtenerProcesos(this.codCia).subscribe({
      next: (procesos) => {
        this.listaProcesos = procesos;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.log('Procesos Creados');
        console.log(this.listaProcesos);
        this.dataSource = new MatTableDataSource(this.listaProcesos);
        this.dataSource.paginator = this.paginator;
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
          if( element.tipo == '005' ) {
            this.decanoLista.push(element);
            console.log(this.decanoLista);
          }
          else if ( element.tipo == '004' ) {
            this.contraparteLista.push(element);
            console.log(this.contraparteLista); 
          }
        })

        this.dataSource = new MatTableDataSource(this.personalVinculacion);        

      }
    })
  }

  getUsers() {
    this.alumnos.obtenerAlumnosVinculacion(this.codCia)
                .subscribe( alumnos => {
                this.alumnosLista = alumnos;
                console.log('Alumnos');
                console.log(this.alumnosLista);

    }) 
  }

}
