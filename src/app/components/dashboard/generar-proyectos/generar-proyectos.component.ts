import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../../shared/services-shared/token.service';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { ProyectosService } from './services/proyectos.service';
import Swal from 'sweetalert2';
import { ProyectoPersonalComponent } from './proyecto-personal/proyecto-personal.component';
import { MatTableDataSource } from '@angular/material/table';
import { CrearConveniosService } from '../crear-convenios/services/crear-convenios.service';
import { ModalConvenioEspecificosComponent } from '../crear-convenios/modal-convenio-especificos/modal-convenio-especificos.component';
import { MatPaginator } from '@angular/material/paginator';
import { GeneralService } from 'src/app/services/general.service';

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
  selector: 'app-generar-proyectos',
  templateUrl: './generar-proyectos.component.html',
  styleUrls: ['./generar-proyectos.component.scss']
})
export class GenerarProyectosComponent implements OnInit {
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator; 

  @Output() controlConvenio = new EventEmitter<void>();

  textButton= 'Crear';
  icon_button= 'add';
  public codecConv: string = '';
  public _convenios: boolean = false;
  public dataSource!: MatTableDataSource<any>;
  public dataSourceProyecto!: MatTableDataSource<any>;
  public columnHead: any = [ 'edit', 'Fecha Creación','Nombre Convenio', 'F. Desde', 'F. Hasta', 'Nombre Convenio I.', 'Representante Convenio I.', 'Representante Convenio U.', 'ID único Universidad' ];
  // 'nombreProyecto',
  public columnHeadProyecto: any = ['edit', 'alias', 'descripcionProyecto', 'nombreConvenioEsp', 'nombreConvenioMarco', 'finicio', 'ffin'];

  public generarProyectoForm = new FormGroup({
    nombreProyecto:                 new FormControl( '', [ Validators.required ]),
    areaDesarrollo:                 new FormControl( '', [ Validators.required ]),
    proyectoProveniente:            new FormControl( '', [ Validators.required ]),
    descripcionProyecto:            new FormControl( '', [ Validators.required ]),
    directorProyecto:               new FormControl( '', [ Validators.required ]),
    idTutor:                        new FormControl( '', [ Validators.required ]),
    fInicio:                        new FormControl( new Date(), [ Validators.required ]),
    fFin:                           new FormControl( new Date(), [ Validators.required ]),
    horas:                          new FormControl( '', [ Validators.required ]),
    alias:                          new FormControl( '', [ Validators.required, Validators.maxLength(50) ])
  });


  public codCia: string = environment.codCia;

  getCia() {
    this.general.getCia().subscribe({
      next: (element:any) => {
        console.warn(element);
        this.codCia = element[0].codcia;
      },
      error: (e:any) => {
        console.error(e)
      },
      complete: () => {
        console.log(this.codCia);
        return this.codCia;
      }
    })
  }
  
  constructor(public dialog: MatDialog, 
              public token: TokenService, 
              public general: GeneralService,
              private proyecto: ProyectosService,
              public convenioMacro: CrearConveniosService,
              public DataMaster: SharedServicesService
               ) { }

  ngOnInit(): void {
    this.obtenerConvenioMacro();
    this.obtenerProyectos();
  }

  public count = 0;
  ValidateMaxLength() {
    this.count ++;
  }

  onClick() {
    this.controlConvenio.emit();
  }

  public marcoLista: any = [];
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator;
  }

  obtenerConvenioMacro() {
    this.convenioMacro.obtenerConveniosMarcos(this.codCia).subscribe({
      next: (marco) => {
        this.marcoLista = marco;
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.dataSource = new MatTableDataSource(this.marcoLista);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  listaProyectosObtenidas: any = [];
  obtenerProyectos() {
    this.proyecto.obtenerProyectos( this.codCia ).subscribe({
      next: (proyectos) => {
        this.listaProyectosObtenidas = proyectos;
        console.warn('PROYECTOS');
        console.warn('----------------------------');
        console.warn(this.listaProyectosObtenidas);
        console.warn('----------------------------');
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSourceProyecto = new MatTableDataSource(this.listaProyectosObtenidas);
        this.dataSourceProyecto.paginator = this.paginator;
      }
    })
  }

  onSubmit() {

    switch (this.textButton) {
      case 'Crear':
        this.guardarProyecto();
        break;
      case 'Editar':
        this.actualizarProyecto();
       break;
    }
  }

  public listaProyecto: any = [];
  guardarProyecto() {
    
    if ( this.generarProyectoForm.controls['nombreProyecto'].value == undefined
          ||
         this.generarProyectoForm.controls['nombreProyecto'].value == null
          ||
         this.generarProyectoForm.controls['nombreProyecto'].value.lenght <= 3 ) {
          Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
         }
    else if ( this.generarProyectoForm.controls['fInicio'].value == undefined
          ||  
          this.generarProyectoForm.controls['fInicio'].value == null
          ||
          this.generarProyectoForm.controls['fInicio'].value <= 3 ) {
            Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if ( this.generarProyectoForm.controls['fFin'].value == undefined
          || 
          this.generarProyectoForm.controls['fFin'].value == null
          ||
          this.generarProyectoForm.controls['fFin'].value <= 3 ) {
            Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if ( this.generarProyectoForm.controls['areaDesarrollo'].value == undefined
          ||
          this.generarProyectoForm.controls['areaDesarrollo'].value == null
          ||
          this.generarProyectoForm.controls['areaDesarrollo'].value <= 3 ) {
            Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
          }
    
    else {

    let fecha = new Date();    
    const codecProyecto: string = 'PROY' + this.token.generateRandomString(10) + '-F-' +  fecha.getDay().toString().padStart(2, '0')+'-'+fecha.getMonth().toString().padStart(2, '0')+'-'+fecha.getFullYear();

    this.listaProyecto = {
      idProyecto: codecProyecto,
      alias:                this.generarProyectoForm.controls['alias'].value,
      nombreProyecto:       this.generarProyectoForm.controls['nombreProyecto'].value,
      finicio:              this.generarProyectoForm.controls['fInicio'].value,
      ffin:                 this.generarProyectoForm.controls['fFin'].value,
      areaDesarrollo:       this.generarProyectoForm.controls['areaDesarrollo'].value,
      idTutor:              this.idTutor,
      proyectoProveniente:  this.codecEsp,
      directorProyecto:     this.directorProyecto,
      descripcionProyecto:  this.generarProyectoForm.controls['descripcionProyecto'].value,
      horas:  this.generarProyectoForm.controls['horas'].value
    }

    this.proyecto.guardarProyecto( this.listaProyecto ).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Proyecto creado...' });
        console.log(x);
      },
      error: (e) => {
        console.error(e)
        Toast.fire({ icon: 'error', title: 'Proyecto no ha sido creado...' });
      },
      complete: () => {
        this.listaProyectosObtenidas.unshift(this.listaProyecto);
        this.dataSource = new MatTableDataSource(this.listaProyectosObtenidas);
        this.limpiar();      
        this._convenios=false;

      }
    })
    }
  }

  applyFilterProyectos(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProyecto.filter = filterValue.trim().toLowerCase();
    this.dataSourceProyecto.paginator = this.paginator;
  }

  limpiar() {
    this.generarProyectoForm.controls['areaDesarrollo']     .setValue('');
    this.generarProyectoForm.controls['descripcionProyecto'].setValue('');
    this.generarProyectoForm.controls['proyectoProveniente'].setValue('');
    this.generarProyectoForm.controls['directorProyecto']   .setValue('');
    this.generarProyectoForm.controls['idTutor']            .setValue('');
    this.generarProyectoForm.controls['alias']              .setValue('');
    this.generarProyectoForm.controls['nombreProyecto'].setValue('');
    this.generarProyectoForm.controls['fInicio'].setValue('');
    this.generarProyectoForm.controls['fFin'].setValue('');
    this.idTutor  = '';
    this.codecEsp = '';
    this.directorProyecto = '';
    this.textButton   = 'Crear';
    this.icon_button  = 'add';
    this._cancel      = false;
  }

  public codecEsp: string = '';
  openDialogConvenios(codec: string, nConvenio: string, tipo: number): void {
    const dialogRef = this.dialog.open( ModalConvenioEspecificosComponent, {
      height: '575px',
      width: '80%',
      data: {
        nombreConvenioMarco: nConvenio,
        codecConvenio: codec,
        tipo: tipo,
        visual: true,
        nombreConvenio: '',
        codecConvenioEsp: ''
      },
    });

    dialogRef.afterClosed().subscribe( result => {      
      
      this.generarProyectoForm.controls['proyectoProveniente'].setValue(result.nombreConvenio);  
      this.codecEsp = result.codecConvenioEsp;
      console.warn( result );
      console.warn(this.codecEsp);
      this._convenios = false;
    });

  }

  catchFile() {

  }

  public idProyecto: string = '';
  public _cancel: boolean = false;
  catchData(data: any) {               
    let inicio = data.finicio.toString().split('T');
    let fin    = data.ffin.toString().split('T');
    this.generarProyectoForm.controls['nombreProyecto']     .setValue(data.nombreProyecto);
    this.generarProyectoForm.controls['fInicio']            .setValue(inicio[0]);
    this.generarProyectoForm.controls['fFin']               .setValue(fin[0]);
    this.generarProyectoForm.controls['areaDesarrollo']     .setValue(data.areaDesarrollo);
    this.generarProyectoForm.controls['descripcionProyecto'].setValue(data.descripcionProyecto);
    this.generarProyectoForm.controls['proyectoProveniente'].setValue(data.nombreConvenioEsp);
    this.generarProyectoForm.controls['directorProyecto']   .setValue(data.directorProyecto);
    this.generarProyectoForm.controls['idTutor']            .setValue(data.tutor);
    this.generarProyectoForm.controls['alias']              .setValue(data.alias);
    this.idProyecto   = data.idProyecto;
    this.idTutor      = data.idTutor;
    this.codecEsp     = data.codecEsp;
    this.directorProyecto = data.idDirectorProyecto;
    this.textButton   = 'Editar';
    this.icon_button  = 'sync_alt';
    this._cancel      = true;
  }

  actualizarProyecto() {

    if ( this.generarProyectoForm.controls['nombreProyecto'].value == undefined
        ||
       this.generarProyectoForm.controls['nombreProyecto'].value == null
        ||
       this.generarProyectoForm.controls['nombreProyecto'].value.lenght <= 3 ) {
        Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
       }
    else if ( this.generarProyectoForm.controls['fInicio'].value == undefined
        ||  
        this.generarProyectoForm.controls['fInicio'].value == null
        ||
        this.generarProyectoForm.controls['fInicio'].value <= 3 ) {
          Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if ( this.generarProyectoForm.controls['fFin'].value == undefined
        || 
        this.generarProyectoForm.controls['fFin'].value == null
        ||
        this.generarProyectoForm.controls['fFin'].value <= 3 ) {
          Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if ( this.generarProyectoForm.controls['areaDesarrollo'].value == undefined
        ||
        this.generarProyectoForm.controls['areaDesarrollo'].value == null
        ||
        this.generarProyectoForm.controls['areaDesarrollo'].value <= 3 ) {
          Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
        }
      
    else { 

      this.listaProyecto = {
        idProyecto:           this.idProyecto,
        alias:                this.generarProyectoForm.controls['alias'].value,
        nombreProyecto:       this.generarProyectoForm.controls['nombreProyecto'].value,
        finicio:              this.generarProyectoForm.controls['fInicio'].value,
        ffin:                 this.generarProyectoForm.controls['fFin'].value,
        areaDesarrollo:       this.generarProyectoForm.controls['areaDesarrollo'].value,
        idTutor:              this.idTutor,
        proyectoProveniente:  this.codecEsp,
        directorProyecto:     this.directorProyecto,
        descripcionProyecto:  this.generarProyectoForm.controls['descripcionProyecto'].value,
        horas:  this.generarProyectoForm.controls['horas'].value
      }

      console.warn('listaProyecto');
      console.warn(this.listaProyecto);

      this.proyecto.actualizarProyectos(this.listaProyecto, this.idProyecto).subscribe({
        next: (x) => {
          Toast.fire({ icon: 'success', title: 'Proyecto actualizado...' });
          console.log(x);
        },
        error: (e) => {
          Toast.fire({ icon: 'error', title: 'Problemas al actualizar...' });
          console.error(e);
        },
        complete: () => {
          this.limpiar();
          this.obtenerProyectos();
          this._convenios=false;
        }
      })
    }
  }

  public idTutor: string = '';
  public directorProyecto: string = '';
  openDialog(tipo: string): void {
    const dialogRef = this.dialog.open( ProyectoPersonalComponent, {
      height: '500px',
      width:  '500px',
      data: {
        tipo:           tipo,
        personal:       '',
        codigoPersonal: ''
      }
    });

    dialogRef.afterClosed().subscribe( result => {
      if( result.tipo == 'Director' ){
        this.idTutor = result.codigoPersonal;
        this.generarProyectoForm.controls['directorProyecto'].setValue(result.personal);
      }

      else if ( result.tipo == 'Tutor' ) {
        this.directorProyecto = result.codigoPersonal;
        this.generarProyectoForm.controls['idTutor'].setValue(result.personal);
      }
    });
  }



}
