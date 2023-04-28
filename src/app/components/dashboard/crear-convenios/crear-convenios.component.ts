import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../../shared/services-shared/token.service';
import { RegistroAlumnoService } from '../../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { PersonalVinculacionService } from '../personal-vinculacion/services/personal-vinculacion.service';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { CrearConveniosService } from './services/crear-convenios.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalConvenioEspecificosComponent } from './modal-convenio-especificos/modal-convenio-especificos.component';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2'

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
  selector: 'app-crear-convenios',
  templateUrl: './crear-convenios.component.html',
  styleUrls: ['./crear-convenios.component.scss']
})

export class CrearConveniosComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public convenioMarcoForm = new FormGroup({
    nombreConvenio:  new FormControl( '', [ Validators.required ]),
    nombreConvenioIntitu:  new FormControl( '', [ Validators.required ]),
    convenioFisico:  new FormControl( '', [ Validators.required ]),
    representanteConvenioI:  new FormControl( '', [ Validators.required ]),
    representanteConvenioU:  new FormControl( '', [ Validators.required ]),
    identificadorUnicoUniversidad:  new FormControl( '', [ Validators.required ]),
    fInicio:   new FormControl( new Date(), [ Validators.required ]),
    fFin:      new FormControl( new Date(), [ Validators.required ])
  });

  public codCia = environment.codCia; 
  constructor(  public dialog:          MatDialog, 
                public token:           TokenService, 
                public convenioMacro:   CrearConveniosService,
                public registrarAlumno: RegistroAlumnoService,
                public personal:        PersonalVinculacionService,
                public DataMaster:      SharedServicesService
               ) { }

  public sexoLista:        any = [];
  public provinciaLista:   any = [];
  public estadoCivilLista: any = [];
  public tipoPersonaLista: any = [];
  public carrerasLista:    any = [];
  public facultadLista:    any = [];
  public dataSource!: MatTableDataSource<any>;
  
  public _FILE: any;
  public callOfOtherComponent: boolean = false;
  public columnHead: any = [ 'edit', 'Fecha Creación','Nombre Convenio', 'F. Desde', 'F. Hasta', 'Nombre Convenio I.', 'Representante Convenio I.', 'Representante Convenio U.', 'ID único Universidad' ];

  ngOnInit(): void {
    this.obtenerConvenioMacro();
    
    this.getDataMaster('PRV00');
    // Estado Civil
    this.getDataMaster('R02');
    // Sexo
    this.getDataMaster('C04');
    // Tipo de persona
    this.getDataMaster('TP01');
    // Carreras
    this.getDataMaster('UG01');
    // Facultad
    this.getDataMaster('UG00');
  }

  onButtonClicked() {
    if( this.callOfOtherComponent ) {
      this.callOfOtherComponent = false;
      console.warn(this.callOfOtherComponent);
    } else {
      this.callOfOtherComponent = true;
      console.warn(this.callOfOtherComponent);
    }
  }

  onSubmit() {

    switch (this.textButton) {
      case 'Crear':
        this.guardarConvenios()
        break;
      case 'Editar':
        this.editarConvenio()
        break;
    }
    
  }



  catchFile() {

  }

  public marcoLista: any = [];
  obtenerConvenioMacro() {
    this.convenioMacro.obtenerConveniosMarcos(this.codCia).subscribe({
      next: (marco) => {
        this.marcoLista = marco;
        console.log('MARCO LISTA');
        console.log(this.marcoLista);
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.dataSource = new MatTableDataSource(this.marcoLista);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  getDataMaster(cod:string) {
    this.DataMaster.getDataMaster(cod).subscribe({
      next: (Data:any) => {

        switch(cod) {
          case 'R02':
            this.estadoCivilLista = Data;
            console.log(this.estadoCivilLista)
            break;
          case 'PRV00':
            this.provinciaLista = Data;
            console.log(this.provinciaLista)
            break;
          case 'C04':
            this.sexoLista = Data;
            console.log(this.sexoLista)
            break;
          case 'TP01':
            this.tipoPersonaLista = Data;
            console.log('this.tipoPersonaLista')
            console.log(this.tipoPersonaLista)
            break;
          case 'UG01':
            this.carrerasLista = Data;
            console.log('this.carrerasLista')
            console.log(this.carrerasLista)
            break;
          case 'UG00':
            this.facultadLista = Data;
            console.log('this.facultadLista')
            console.log(this.facultadLista)
            break;
        }
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator;
  }



  public vinculacionMacro: any = [];
  guardarConvenios() {
  
    if (
        this.convenioMarcoForm.controls['nombreConvenio'].value == undefined
        ||
        this.convenioMarcoForm.controls['nombreConvenio'].value == null
        ||
        this.convenioMarcoForm.controls['nombreConvenio'].value == ''
      ){
        Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
      }
    else if (
      this.convenioMarcoForm.controls['representanteConvenioU'].value == undefined
      ||
      this.convenioMarcoForm.controls['representanteConvenioU'].value == ''
      ||
      this.convenioMarcoForm.controls['representanteConvenioU'].value == null
    ) {
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if (
      this.convenioMarcoForm.controls['representanteConvenioI'].value == undefined
      ||
      this.convenioMarcoForm.controls['representanteConvenioI'].value == null
      ||
      this.convenioMarcoForm.controls['representanteConvenioI'].value == ''
    ) {
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if ( this.convenioMarcoForm.controls['representanteConvenioI'].value == undefined
      ||
      this.convenioMarcoForm.controls['representanteConvenioI'].value == null
      ||
      this.convenioMarcoForm.controls['representanteConvenioI'].value == '' ) {
        Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if (  this.convenioMarcoForm.controls['nombreConvenioIntitu'].value == undefined
      ||
      this.convenioMarcoForm.controls['nombreConvenioIntitu'].value == null
      ||
      this.convenioMarcoForm.controls['nombreConvenioIntitu'].value == '' ) {
        Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else if ( 
      this.convenioMarcoForm.controls['fInicio'].value == undefined
      ||
      this.convenioMarcoForm.controls['fInicio'].value == ''
      ||
      this.convenioMarcoForm.controls['fInicio'].value == null
     ) {
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
     else if ( 
      this.convenioMarcoForm.controls['fFin'].value == undefined
      ||
      this.convenioMarcoForm.controls['fFin'].value == ''
      ||
      this.convenioMarcoForm.controls['fFin'].value == null
     ) {
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
    else { 
      let fecha = new Date();    
      const codecConvenio: string = 'CON-' + this.token.generateRandomString(10) + '-F-' +  fecha.getDay().toString().padStart(2, '0')+'-'+fecha.getMonth().toString().padStart(2, '0')+'-'+fecha.getFullYear();

      this.vinculacionMacro = {
        nombreConvenio:                this.convenioMarcoForm.controls['nombreConvenio'].value,
        idCia:                         this.codCia,
        representanteConvenioU:        this.convenioMarcoForm.controls['representanteConvenioU'].value,
        representanteConvenioI:        this.convenioMarcoForm.controls['representanteConvenioI'].value,
        codConvenioMarco:              codecConvenio,
        nombreConvenioIntitu:          this.convenioMarcoForm.controls['nombreConvenioIntitu'].value,
        identificadorUnicoUniversidad: this.convenioMarcoForm.controls['identificadorUnicoUniversidad'].value,
        FechaIni: this.convenioMarcoForm.controls['fInicio'].value,
        Fachafin: this.convenioMarcoForm.controls['fFin'].value,
        idEstado: '001'
      }

      this.convenioMacro.guardarConvenioMacro(this.vinculacionMacro).subscribe({
        next: ( x: any ) => {
          console.log(x);
          Toast.fire({ icon: 'success', title: 'Convenio macro creado...' });
        }, error: () => {
          Toast.fire({ icon: 'error', title: 'No se ha podido crear el convenio macro...' });
        }, complete: () => {
          this.marcoLista.unshift(this.vinculacionMacro);
          this.dataSource = new MatTableDataSource(this.marcoLista);
          this.limpiar();
        }
      })
  }
  }

  textButton= 'Crear';
  icon_button= 'add';
  public codecConv: string = '';
  addDataEdit( nombreConvenio: string, representanteConvenioU: string,representanteConvenioI: string,
               nombreConvenioIntitu: string, identificadorUnicoUniversidad: string,
               fInicio: Date, fFin: Date, codeConv: string ) {
    
                this._cancel = true;
    // let inicio = fInicio.toString().slice(0,10);
    // let fin = fFin.toString().slice(0,10);

    console.log(fInicio)
    console.log(fFin)

    this.codecConv = codeConv
    this.convenioMarcoForm.controls['nombreConvenio'].setValue(nombreConvenio);
    this.convenioMarcoForm.controls['representanteConvenioU'].setValue(representanteConvenioU);
    this.convenioMarcoForm.controls['representanteConvenioI'].setValue(representanteConvenioI);
    this.convenioMarcoForm.controls['nombreConvenioIntitu'].setValue(nombreConvenioIntitu);
    this.convenioMarcoForm.controls['identificadorUnicoUniversidad'].setValue(identificadorUnicoUniversidad);
    this.convenioMarcoForm.controls['fInicio'].setValue( fInicio);
    this.convenioMarcoForm.controls['fFin'].setValue(fFin);

    this.textButton = 'Editar';
    this.icon_button = 'sync_alt'
  }

  editarConvenio() {

    if (
      this.convenioMarcoForm.controls['nombreConvenio'].value == undefined
      ||
      this.convenioMarcoForm.controls['nombreConvenio'].value == null
      ||
      this.convenioMarcoForm.controls['nombreConvenio'].value == ''
    ){
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
    }
  else if (
    this.convenioMarcoForm.controls['representanteConvenioU'].value == undefined
    ||
    this.convenioMarcoForm.controls['representanteConvenioU'].value == ''
    ||
    this.convenioMarcoForm.controls['representanteConvenioU'].value == null
  ) {
    Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
  }
  else if (
    this.convenioMarcoForm.controls['representanteConvenioI'].value == undefined
    ||
    this.convenioMarcoForm.controls['representanteConvenioI'].value == null
    ||
    this.convenioMarcoForm.controls['representanteConvenioI'].value == ''
  ) {
    Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
  }
  else if ( this.convenioMarcoForm.controls['representanteConvenioI'].value == undefined
    ||
    this.convenioMarcoForm.controls['representanteConvenioI'].value == null
    ||
    this.convenioMarcoForm.controls['representanteConvenioI'].value == '' ) {
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
  }
  else if (  this.convenioMarcoForm.controls['nombreConvenioIntitu'].value == undefined
    ||
    this.convenioMarcoForm.controls['nombreConvenioIntitu'].value == null
    ||
    this.convenioMarcoForm.controls['nombreConvenioIntitu'].value == '' ) {
      Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
  }
  else if ( 
    this.convenioMarcoForm.controls['fInicio'].value == undefined
    ||
    this.convenioMarcoForm.controls['fInicio'].value == ''
    ||
    this.convenioMarcoForm.controls['fInicio'].value == null
   ) {
    Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
  }
   else if ( 
    this.convenioMarcoForm.controls['fFin'].value == undefined
    ||
    this.convenioMarcoForm.controls['fFin'].value == ''
    ||
    this.convenioMarcoForm.controls['fFin'].value == null
   ) {
    Toast.fire({ icon: 'warning', title: 'Campos por llenar...' });
  }
  else { 

    this.vinculacionMacro = {
      nombreConvenio:                this.convenioMarcoForm.controls['nombreConvenio'].value,
      idCia:                         this.codCia,
      representanteConvenioU:        this.convenioMarcoForm.controls['representanteConvenioU'].value,
      representanteConvenioI:        this.convenioMarcoForm.controls['representanteConvenioI'].value,
      codConvenioMarco:              this.codecConv,
      nombreConvenioIntitu:          this.convenioMarcoForm.controls['nombreConvenioIntitu'].value,
      identificadorUnicoUniversidad: this.convenioMarcoForm.controls['identificadorUnicoUniversidad'].value,
      FechaIni: this.convenioMarcoForm.controls['fInicio'].value,
      Fachafin: this.convenioMarcoForm.controls['fFin'].value,
      idEstado: '001'
    }

    console.warn('Para actualizar data convenio');
    console.warn(this.vinculacionMacro);

    this.convenioMacro.editarConvenioMarco(this.codecConv, this.vinculacionMacro).subscribe(

      {
        next: (x) => {
          Toast.fire({ icon: 'success', title: 'Convenio marco ha sido editado...' });
        },
        error: (e) => {
          Toast.fire({ icon: 'error', title: 'no se podido editar el convenio...' });
        },
        complete: () => {
          this.marcoLista.filter( (element: any) => {
            if( element.codConvenioMarco == this.codecConv ) {

              element.nombreConvenio = this.convenioMarcoForm.controls['nombreConvenio'].value;
              element.idCia = this.codCia;
              element.representanteConvenioU = this.convenioMarcoForm.controls['representanteConvenioU'].value;
              element.representanteConvenioI = this.convenioMarcoForm.controls['representanteConvenioI'].value;
              element.codConvenioMarco = this.codecConv,
              element.nombreConvenioIntitu = this.convenioMarcoForm.controls['nombreConvenioIntitu'].value;
              element.identificadorUnicoUniversidad = this.convenioMarcoForm.controls['identificadorUnicoUniversidad'].value;
              element.fechModif=  new Date();
              element.fechaIni = this.convenioMarcoForm.controls['fechaIni'].value;
              element.fachafin = this.convenioMarcoForm.controls['fachafin'].value;

            }
          });
          // this.dataSource.paginator = this.paginator;
          this.limpiar();
        }
      }

    )
  }
  }

  _cancel: boolean = false;
  limpiar() {
    this.textButton = 'Crear';
    this.icon_button = 'add';
    this.convenioMarcoForm.controls['nombreConvenio'].setValue('');
    this.convenioMarcoForm.controls['representanteConvenioU'].setValue('');
    this.convenioMarcoForm.controls['representanteConvenioI'].setValue('');
    this.convenioMarcoForm.controls['nombreConvenioIntitu'].setValue('');
    this.convenioMarcoForm.controls['identificadorUnicoUniversidad'].setValue('');
    this.convenioMarcoForm.controls['fInicio'].setValue(new Date());
    this.convenioMarcoForm.controls['fFin'].setValue(new Date());
    this._cancel = false;
  }

  openDialog(codec: string, nConvenio: string, tipo: number): void {
    const dialogRef = this.dialog.open( ModalConvenioEspecificosComponent, {
      height: '575px',
      width: '80%',
      data: {
        nombreConvenioMarco: nConvenio,
        codecConvenio: codec,
        tipo: tipo
           },
    });


    dialogRef.afterClosed().subscribe( result => {      
      
      console.warn( result );

      this.obtenerConvenioMacro();

    });
  }


}
