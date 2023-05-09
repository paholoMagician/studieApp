import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedServicesService } from '../shared/services-shared/shared-services.service';
import { GeneralService } from 'src/app/services/general.service';
import { TokenService } from '../shared/services-shared/token.service';
import { InstitutosService } from '../dashboard/insitutos-maestro/services/institutos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment.prod';
import { EmpresaService } from './services/empresa.service';
import Swal from 'sweetalert2'
import * as moment from 'moment';

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
  selector: 'app-miempresa',
  templateUrl: './miempresa.component.html',
  styleUrls: ['./miempresa.component.scss']
})
export class MiempresaComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public dataSource!: MatTableDataSource<any>;
  columnHead: any = [ 'edit', 'nombre', 'descripcion', 'direccion', 'email1', 'telef_a', 'web' ];
  textButton: string = 'Crear';
  icon_button: string = 'add';
  _cancel: boolean = false;

  public estadoCivilLista: any = [];
  public provinciaLista: any = [];
  public sexoLista: any = [];
  public tipoPersonaLista: any = [];
  public carrerasLista: any = [];
  public facultadLista: any = [];
  public tipoInstitucionLista: any = [];
  public tipoCuenta: any = [];

  public codCia: string = '';

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

  constructor( public DataMaster: SharedServicesService, 
               public general: GeneralService, 
               public token: TokenService,
               public institutos: EmpresaService ) { }


  public institutosForm = new FormGroup({
    ruc:          new FormControl( '', [ Validators.required ]),
    correo:       new FormControl( '', [ Validators.required ]),
    cta1:         new FormControl( '', [ Validators.required ]),
    cta2:         new FormControl( '', [ Validators.required ]),
    nombre:       new FormControl( '', [ Validators.required ]),
    descripcion:  new FormControl( '', [ Validators.required ]),
    telef_a:      new FormControl( '', [ Validators.required ]),
    telf_b:       new FormControl( '', [ Validators.required ]),
    telf_c:       new FormControl( '', [ Validators.required ]),
    email1:       new FormControl( '', [ Validators.required ]),
    email2:       new FormControl( '', [ Validators.required ]),
    direccion:    new FormControl( '', [ Validators.required ]),
    fecCrea:      new FormControl( '', [ Validators.required ]),
    web:          new FormControl( '', [ Validators.required ]),
    horasVinc:    new FormControl( '', [ Validators.required ]),
    codProvincia: new FormControl( '', [ Validators.required ]),
    codCanton:    new FormControl( '', [ Validators.required ]),
    tipoCta1:    new FormControl( '', [ Validators.required ]),
    fecha_fundacion:    new FormControl(new Date())
  });


  ngOnInit(): void {
    this.getCia();
    this.getDataMaster('PRV00');
    this.getDataMaster('R12');
    this.obtenerEmpresa();
  }

  
  getDataMaster(cod:string) {
    this.DataMaster.getDataMaster(cod).subscribe({
      next: (Data) => {

        switch(cod) {
          case 'R02':
            this.estadoCivilLista = Data;
            break;
          case 'PRV00':
            this.provinciaLista = Data;
            break;
          case 'C04':
            this.sexoLista = Data;
            break;
          case 'TP01':
            this.tipoPersonaLista = Data;
            break;
          case 'UG01':
            this.carrerasLista = Data;
            break;
          case 'UG00':
            this.facultadLista = Data;
            break;
          case 'TIN':
            this.tipoInstitucionLista = Data;
            break;
          case 'R12':
            this.tipoCuenta = Data;
            break;
        }
      }
    })
  }


  public cantonLista:    any = [];
  getCantones() {
    this.DataMaster.getDataMaster(Number( this.institutosForm.controls['codProvincia'].value)  ).subscribe({
      next: (cantones) => {
        this.cantonLista = cantones;
      }, 
      error: (e) => {
        console.error(e);
      }
    })
  }

  adjuntTipo() {

  }

  limpiar() {
    this.institutosForm.controls['ruc']         .setValue('');
    this.institutosForm.controls['correo']      .setValue('');
    this.institutosForm.controls['nombre']      .setValue('');
    this.institutosForm.controls['descripcion'] .setValue('');
    this.institutosForm.controls['telef_a']     .setValue('');
    this.institutosForm.controls['telf_b']      .setValue('');
    this.institutosForm.controls['telf_c']      .setValue('');
    this.institutosForm.controls['email1']      .setValue('');
    this.institutosForm.controls['email2']      .setValue('');
    this.institutosForm.controls['direccion']   .setValue('');
    this.institutosForm.controls['web']         .setValue('');
    this.institutosForm.controls['codProvincia'].setValue('');
    this.institutosForm.controls['codCanton']   .setValue('');
    this.institutosForm.controls['fecha_fundacion'].setValue(new Date());
    this.textButton = 'Crear';
    this.icon_button = 'add';
    this.consinsti = '';
    this._cancel = false;
  }

  onSubmit() {
    switch( this.textButton ) {
      case 'Crear':
        this.guardarInstituto();
        break;
      case 'Actualizar':
        this.actualizarEmpresa();
        break;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public consinsti: string = '';
  catchData(data: any) {

    let fundacion = data.fecha_fundacion.toString().split('T');
    // let fechaFormateada = moment(fundacion[0]).format('DD-MM-YYYY');
    console.log(fundacion[0]);
    // console.log(fechaFormateada);


    this.institutosForm.controls['ruc']         .setValue(data.ruc);
    this.institutosForm.controls['correo']      .setValue(data.correo);
    this.institutosForm.controls['nombre']      .setValue(data.nombre);
    this.institutosForm.controls['descripcion'] .setValue(data.descripcion);
    this.institutosForm.controls['telef_a']     .setValue(data.telefA);
    this.institutosForm.controls['telf_b']      .setValue(data.telfB);
    this.institutosForm.controls['telf_c']      .setValue(data.telfC);
    this.institutosForm.controls['email1']      .setValue(data.email1);
    this.institutosForm.controls['email2']      .setValue(data.email2);
    this.institutosForm.controls['direccion']   .setValue(data.direccion);
    this.institutosForm.controls['web']         .setValue(data.web);
    this.institutosForm.controls['codProvincia'].setValue(data.codProvincia);
    this.getCantones()
    this.institutosForm.controls['codCanton']   .setValue(data.codCanton);
    this.institutosForm.controls['fecha_fundacion'].setValue(fundacion[0]);
    this.textButton = 'Actualizar';
    this.icon_button = 'sync_alt';
    this.consinsti = data.codcia;
    this._cancel = true;
  }


    public institutoModdel: any = [];
    guardarInstituto() {  

      if ( this.listaInstituto.length == 0 ) {
        if( this.institutosForm.controls['ruc'].value == undefined || this.institutosForm.controls['ruc'].value == '' || this.institutosForm.controls['ruc'].value == null ) Toast.fire({ icon: 'warning', title: 'R.U.C necesario...' });
      // if( this.institutosForm.controls['correo'].value == undefined || this.institutosForm.controls['correo'].value == '' || this.institutosForm.controls['correo'].value == null ) Toast.fire({ icon: 'warning', title: 'R.U.C necesario...' });
      if( this.institutosForm.controls['nombre'].value == undefined || this.institutosForm.controls['nombre'].value == '' || this.institutosForm.controls['nombre'].value == null ) Toast.fire({ icon: 'warning', title: 'Nombre de la institución necesario...' });
      // if( this.institutosForm.controls['telefA'].value == undefined || this.institutosForm.controls['telefA'].value == '' || this.institutosForm.controls['telefA'].value == null ) Toast.fire({ icon: 'warning', title: 'Necistamos por lo menos un número de contacto...' });
      if( this.institutosForm.controls['email1'].value == undefined || this.institutosForm.controls['email1'].value == '' || this.institutosForm.controls['email1'].value == null ) Toast.fire({ icon: 'warning', title: 'Necistamos por lo menos una drección email...' });
      if( this.institutosForm.controls['codProvincia'].value == undefined || this.institutosForm.controls['codProvincia'].value == '' || this.institutosForm.controls['codProvincia'].value == null ) Toast.fire({ icon: 'warning', title: 'El campo provincia no puede estar vacío...' });
      if( this.institutosForm.controls['codCanton'].value == undefined || this.institutosForm.controls['codCanton'].value == '' || this.institutosForm.controls['codCanton'].value == null ) Toast.fire({ icon: 'warning', title: 'El campo cantón no puede estar vacío...' });

      else {
      this.institutoModdel = {
      
        "codcia":         'INSTITUTO-' + this.token.generateRandomString(10),
        "ruc":            this.institutosForm.controls['ruc'].value,
        "correo":         this.institutosForm.controls['correo'].value,
        "nombre":         this.institutosForm.controls['nombre'].value,
        "descripcion":    this.institutosForm.controls['descripcion'].value,
        "telefA":         this.institutosForm.controls['telef_a'].value,
        "LicenceCodec":   'tipo1',
        "telfB":          this.institutosForm.controls['telf_b'].value,
        "telfC":          this.institutosForm.controls['telf_c'].value,
        "email1":         this.institutosForm.controls['email1'].value,
        "email2":         this.institutosForm.controls['email2'].value,
        "direccion":      this.institutosForm.controls['direccion'].value,
        "fecCrea":        new Date(),
        "web":            this.institutosForm.controls['web'].value,
        "codProvincia":   this.institutosForm.controls['codProvincia'].value,
        "codCanton":      this.institutosForm.controls['codCanton'].value,
        "fechaFundacion": this.institutosForm.controls['fecha_fundacion'].value
      
      }

      console.log(this.institutoModdel);

      this.institutos.guardarEmpresa(this.institutoModdel).subscribe({
        next: () => {
          Toast.fire({
                  icon: 'success',
                  title: 'Mi instituto ha sido generado...'
                })
        }, error: (e) => {
          Toast.fire({
            icon: 'error',
            title: 'No hemos podido generarlo...'
          })
        }, complete: () => {
          this.obtenerEmpresa();
          this.limpiar();
        }
      })
    } 
      }else {
        Toast.fire({
          icon: 'question',
          title: 'Tu licencia solo te permite manejar 1 insituto...',
          timer: 3500
        })
      }

      
    }

  actualizarEmpresa() {
    if( this.institutosForm.controls['ruc'].value == undefined || this.institutosForm.controls['ruc'].value == '' || this.institutosForm.controls['ruc'].value == null ) Toast.fire({ icon: 'warning', title: 'R.U.C necesario...' });
    if( this.institutosForm.controls['nombre'].value == undefined || this.institutosForm.controls['nombre'].value == '' || this.institutosForm.controls['nombre'].value == null ) Toast.fire({ icon: 'warning', title: 'Nombre de la institución necesario...' });
    // if( this.institutosForm.controls['telefA'].value == undefined || this.institutosForm.controls['telefA'].value == '' || this.institutosForm.controls['telefA'].value == null ) Toast.fire({ icon: 'warning', title: 'Necistamos por lo menos un número de contacto...' });
    if( this.institutosForm.controls['email1'].value == undefined || this.institutosForm.controls['email1'].value == '' || this.institutosForm.controls['email1'].value == null ) Toast.fire({ icon: 'warning', title: 'Necistamos por lo menos una drección email...' });
    if( this.institutosForm.controls['codProvincia'].value == undefined || this.institutosForm.controls['codProvincia'].value == '' || this.institutosForm.controls['codProvincia'].value == null ) Toast.fire({ icon: 'warning', title: 'El campo provincia no puede estar vacío...' });
    if( this.institutosForm.controls['codCanton'].value == undefined || this.institutosForm.controls['codCanton'].value == '' || this.institutosForm.controls['codCanton'].value == null ) Toast.fire({ icon: 'warning', title: 'El campo cantón no puede estar vacío...' });

    else {
    this.institutoModdel = {
    
      "codcia":         this.consinsti,
      "ruc":            this.institutosForm.controls['ruc'].value,
      "correo":         this.institutosForm.controls['correo'].value,
      "nombre":         this.institutosForm.controls['nombre'].value,
      "descripcion":    this.institutosForm.controls['descripcion'].value,
      "telefA":         this.institutosForm.controls['telef_a'].value,
      "telfB":          this.institutosForm.controls['telf_b'].value,
      "telfC":          this.institutosForm.controls['telf_c'].value,
      "email1":         this.institutosForm.controls['email1'].value,
      "email2":         this.institutosForm.controls['email2'].value,
      "direccion":      this.institutosForm.controls['direccion'].value,
      "fecCrea":        new Date(),
      "web":            this.institutosForm.controls['web'].value,
      "codProvincia":   this.institutosForm.controls['codProvincia'].value,
      "codCanton":      this.institutosForm.controls['codCanton'].value,
      "fechaFundacion": this.institutosForm.controls['fecha_fundacion'].value
    
    }
  
    this.institutos.actualizarInstituto(this.consinsti, this.institutoModdel).subscribe({
      next: () => {
        Toast.fire({
                icon: 'success',
                title: 'Mi instituto ha sido actualizado...'
              })
      }, error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'No hemos podido actualizarlo...'
        })
      }, complete: () => {
        this.obtenerEmpresa();
        this.limpiar();
      }
    })  
  
  } 
  }
    
  eliminarInstituto(codCia:string) {
    
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta acción es irreversible, perderás tus datos!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.institutos.eliminarInstituto(codCia).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado!',
              'La institución ha sido eliminada.',
              'success'
            )
            this.obtenerEmpresa()
          },error: (e) => {
            Swal.fire(
              'Upps!',
              'No hemos podido eliminarla.',
              'error'
            )
          }
        })
      }
    })
  }

  public msjLicense: string = '';
  public listaInstituto: any = [];
    obtenerEmpresa() {

      if(this.listaInstituto.length == 0) this.msjLicense = 'Tu licencia solo te permite manejar 1 insituto...';

      this.institutos.obtenerEmpresa().subscribe({
        next: (empresa) => {
          this.listaInstituto = empresa;
          console.log(this.listaInstituto)
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.dataSource = new MatTableDataSource(this.listaInstituto);
          this.dataSource.paginator = this.paginator;
        }
      });
    }

}
