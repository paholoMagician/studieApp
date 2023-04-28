import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CrearConveniosComponent } from '../crear-convenios.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from 'src/app/components/shared/services-shared/token.service';
import { SharedServicesService } from 'src/app/components/shared/services-shared/shared-services.service';
import { CrearConveniosService } from '../services/crear-convenios.service';
import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material/table';

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
  selector: 'app-modal-convenio-especificos',
  templateUrl: './modal-convenio-especificos.component.html',
  styleUrls: ['./modal-convenio-especificos.component.scss']
})
export class ModalConvenioEspecificosComponent implements OnInit {

  _view_convEspe: boolean = false;
  _action_convEspe: boolean = false;
  _button_text: string = 'Crear';
  _icon_button: string = 'add'

  public dataSource!: MatTableDataSource<any>;
  public convenioAdicionalForm = new FormGroup({
    nombreConvenio:                   new FormControl( '', [ Validators.required ]),
    nombreConvenioIntitu:             new FormControl( '', [ Validators.required ]),
    fInicio:                          new FormControl( new Date(), [ Validators.required ]),
    fFin:                             new FormControl( new Date(), [ Validators.required ]),
    convenioFisico:                   new FormControl( '', [ Validators.required ])
  });

  public codCia = environment.codCia; 
  constructor(public dialog: MatDialog, 
              public token: TokenService, 
              public convenioMacro: CrearConveniosService,
              public DataMaster: SharedServicesService,
              public dialogRef: MatDialogRef<CrearConveniosComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
               ) { }


  public nombreConvenio: string = '';
  public columnHead: any = [ 'edit', 'Nombre Convenio', 'Nombre Institucional Convenio', 'Fecha Inicio', 'Fecha Final' ];
  _title: string = 'Añadir convenio específico';
  _icon: string = 'file_present';
  _icon_change: string = 'edit'
  ngOnInit(): void {

    // alert(this.data.visual)

    if (this.data.visual) {
      this._icon_change = 'done';
    } else {
      this._icon_change = 'edit';
    }

    this.data.nombreConvenioMarco;

    if( this.data.tipo == 0 ) {
      this._action_convEspe = true;
      this._view_convEspe = false;
      this._title = 'Añadir convenio específico';
      this._icon = 'file_present';
    } else {
      this._action_convEspe = false;
      this._view_convEspe = true;
      this._title = 'Visualizar Convenios Específicos';
      this._icon = 'plagiarism'
      this.obtenerConveniosEspecificos(this.data.codecConvenio);
    }

  }

  onSubmit() {
    switch (this._button_text) {
      case 'Crear':
        this.guardarConvenioEspecifico();
        break;
      case 'Editar':
        this.editarConvenioEsp();
        break;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  listaConveniosEspecifico: any = [];
  guardarConvenioEspecifico() {

    if( this.convenioAdicionalForm.controls['nombreConvenio'].value == undefined
        || 
        this.convenioAdicionalForm.controls['nombreConvenio'].value == null
        ||
        this.convenioAdicionalForm.controls['nombreConvenio'].value == ''
        ||
        this.convenioAdicionalForm.controls['nombreConvenio'].value.length <= 2 ) {
          Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
        }
    
    else if ( this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value == undefined
        ||
        this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value == null
        ||
        this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value == ''
        ||
        this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value <= 2
    ) {
          Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
    } 
    else if ( this.convenioAdicionalForm.controls['fInicio'].value == undefined
        ||
        this.convenioAdicionalForm.controls['fInicio'].value == null
        ||
        this.convenioAdicionalForm.controls['fInicio'].value == ''
      ) {
        Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
    }
    else if ( this.convenioAdicionalForm.controls['fFin'].value == undefined
        ||
        this.convenioAdicionalForm.controls['fFin'].value == null
        ||
        this.convenioAdicionalForm.controls['fFin'].value == ''
      ) {
        Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
    }

    else {

      let fecha = new Date()
      let codec = 'CONVES-'+this.token.generateRandomString(10) +'-F-' +  fecha.getDay().toString().padStart(2, '0')+'-'+fecha.getMonth().toString().padStart(2, '0')+'-'+fecha.getFullYear(); 
  
      this.listaConveniosEspecifico = { 
        codConvenioEsp: codec,
        nombreConvenio:             this.convenioAdicionalForm.controls['nombreConvenio'].value,
        nombreInstitucionConvenio:  this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value,
        finicio:                    this.convenioAdicionalForm.controls['fInicio'].value,
        ffin:                       this.convenioAdicionalForm.controls['fFin'].value,
        codConvenioMarco: this.data.codecConvenio,
        idEstado: '001'
      }

      console.log(this.listaConveniosEspecifico);

      this.convenioMacro.guardarConvenioEspecifico(this.listaConveniosEspecifico).subscribe(
        {
          next: (x) => {
            console.log(x);
            Toast.fire({ icon: 'success', title: 'Convenio específico creado...' });
          },
          error: (e) => {
            console.error(e);
            Toast.fire({ icon: 'error', title: 'Convenio específico creado...' });
          },
          complete: () => {
            this.limpiar();
          }
        }
      )
    }

  }

  editarConvenioEsp() {

    if( this.convenioAdicionalForm.controls['nombreConvenio'].value == undefined
        || 
        this.convenioAdicionalForm.controls['nombreConvenio'].value == null
        ||
        this.convenioAdicionalForm.controls['nombreConvenio'].value == ''
        ||
        this.convenioAdicionalForm.controls['nombreConvenio'].value.length <= 2 ) {
          Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
        }
    
    else if ( this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value == undefined
        ||
        this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value == null
        ||
        this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value == ''
        ||
        this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value <= 2
    ) {
          Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
    } 
    else if ( this.convenioAdicionalForm.controls['fInicio'].value == undefined
        ||
        this.convenioAdicionalForm.controls['fInicio'].value == null
        ||
        this.convenioAdicionalForm.controls['fInicio'].value == ''
      ) {
        Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
    }
    else if ( this.convenioAdicionalForm.controls['fFin'].value == undefined
        ||
        this.convenioAdicionalForm.controls['fFin'].value == null
        ||
        this.convenioAdicionalForm.controls['fFin'].value == ''
      ) {
        Toast.fire({ icon: 'warning', title: 'Tienes campos por llenar...' });
    }

    else {
    this.listaConveniosEspecifico = { 
      codConvenioEsp: this.codecConv,
      nombreConvenio: this.convenioAdicionalForm.controls['nombreConvenio'].value,
      nombreInstitucionConvenio: this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value,
      finicio: this.convenioAdicionalForm.controls['fInicio'].value,
      ffin: this.convenioAdicionalForm.controls['fFin'].value,
      codConvenioMarco: this.data.codecConvenio,
      idEstado: '001'
    }

    this.convenioMacro.editarConvenioEspecifico( this.codecConv, this.listaConveniosEspecifico ).subscribe({
      next:() => {
        Toast.fire({ icon: 'success', title: 'Convenio específico editado exitosamente...' });
      }, error: (e) => {
        console.error(e);
        Toast.fire({ icon: 'error', title: 'Convenio específico no se ha podido editar...' });
      }, complete: () => {
        this.convenioEspecificoLista.filter( (element:any) => {
          if ( element.codConvenioEsp == this.codecConv ) {
            element.nombreConvenio = this.convenioAdicionalForm.controls['nombreConvenio'].value;
            element.nombreInstitucionConvenio = this.convenioAdicionalForm.controls['nombreConvenioIntitu'].value;
            element.finicio = this.convenioAdicionalForm.controls['fInicio'].value;
            element.ffin = this.convenioAdicionalForm.controls['fFin'].value;
          }
        })
        this._action_convEspe = false;
        this.limpiar()
      }
    })  
    }
  }

  public codecConv: string = '';
  catchDataEdit(codeConv: string, nombreConvenio: string, nombreInstitucionConvenio: string, finicio: any, ffin: any)   {    
    if( this._icon_change == 'done' ) {
      this.data.nombreConvenio   = nombreConvenio;
      this.data.codecConvenioEsp = codeConv;
      this.onNoClick();
    }
    else {
      this._action_convEspe = true;
      let inicio = finicio.toString().slice(0,10);
      let fin = ffin.toString().slice(0,10);
      this.codecConv = codeConv
      this._icon_button = 'sync_alt';
      this._button_text = 'Editar';
      this.convenioAdicionalForm.controls['nombreConvenio'].setValue(nombreConvenio);
      this.convenioAdicionalForm.controls['nombreConvenioIntitu'].setValue(nombreInstitucionConvenio);
      this.convenioAdicionalForm.controls['fInicio'].setValue(inicio);
      this.convenioAdicionalForm.controls['fFin'].setValue(fin);
    }
  }

  convenioEspecificoLista: any = [];
  obtenerConveniosEspecificos( codMarco: string ) {
    this.convenioMacro.obtenerConvenioEspecifico(codMarco).subscribe( 
      {
        next: (cEspecifico) => {
          this.convenioEspecificoLista = cEspecifico;
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.dataSource = new MatTableDataSource(this.convenioEspecificoLista);
        }
      }
     )
  }

  limpiar() {
    this._icon_button = 'add';
    this._button_text = 'Crear';
    this.convenioAdicionalForm.controls['nombreConvenio'].setValue('');
    this.convenioAdicionalForm.controls['nombreConvenioIntitu'].setValue('');
    this.convenioAdicionalForm.controls['fInicio'].setValue(new Date().toString().slice(0,10));
    this.convenioAdicionalForm.controls['fFin'].setValue(new Date().toString().slice(0,10));
  }

  catchFile(){

  }

  onNoClick(): void {
    this.limpiar();
    this.dialogRef.close(this.data);
  }
}
