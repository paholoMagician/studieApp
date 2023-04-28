import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../../shared/services-shared/token.service';
import { environment } from 'src/environments/environment.prod';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { PersonalVinculacionService } from './services/personal-vinculacion.service';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { create } from 'domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RegistroAlumnoService } from '../../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from '../../login/services/login.service';
import { InstitutosService } from '../insitutos-maestro/services/institutos.service';

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
  selector: 'app-personal-vinculacion',
  templateUrl: './personal-vinculacion.component.html',
  styleUrls: ['./personal-vinculacion.component.scss']
})

export class PersonalVinculacionComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator; 

  public columnHead: any = ['edit', 'Nombre', 'cedula', 'tipoPersonal', 'Correo', 'telefonoCelular', 'provincia', 'direccion']
  public dataSource!: MatTableDataSource<any>;
  public codCia = environment.codCia;
  constructor( private loginService: LoginService, public institutos: InstitutosService, public token: TokenService,public registrarAlumno: RegistroAlumnoService, public personal: PersonalVinculacionService, public DataMaster: SharedServicesService ) { }
  public sexoLista:        any = [];
  public provinciaLista:   any = [];
  public estadoCivilLista: any = [];
  public tipoPersonaLista: any = [];
  public carrerasLista:    any = [];
  public facultadLista:    any = [];
  public cantonLista:    any = [];
  ngOnInit(): void { 

    // Provincia
    // this.getDataMaster('R13');
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
    this.obtenerPersonalVinculacion();
    // this.personalVinculacionForm.controls['tipoPers'].setValue('Docente')

  }

  public personalVinculacionForm = new FormGroup({
    nombrePersonal:  new FormControl( '', [ Validators.required ]),
    cedula:          new FormControl( '', [ Validators.required ]),
    email:           new FormControl( '', [ Validators.required, Validators.email ]),
    emailPers:       new FormControl( '', [ Validators.email ]),
    edad:            new FormControl( 0 ),
    idProvincia:     new FormControl( '' ),
    direccion:       new FormControl( '' ),
    celular:         new FormControl( '' ),
    tipo:            new FormControl( '' ),
    telCasa:         new FormControl( '' ),
    carrera:         new FormControl( '' ),
    facultad:        new FormControl( '' ),
    sexo:            new FormControl( '' ),
    idCanton:        new FormControl( '' ),
    idInstituto:     new FormControl( '' )
  });

  public textButton: string = 'Crear';
  public _icon: string = 'add';
  onSubmit() {
    
    switch (this.textButton) {
      case 'Crear':
        this.guardarPersonal();
        break;
      case 'Editar':
        this.actualizarPersonal();
       break;
    }
  }

  getCantones() {

    console.warn(this.personalVinculacionForm.controls['idProvincia'].value)

    this.DataMaster.getDataMaster(Number( this.personalVinculacionForm.controls['idProvincia'].value) ).subscribe({
      next: (cantones) => {
        this.cantonLista = cantones;
      }, 
      error: (e) => {
        console.error(e);
      }
    })
  }

  catchData(data:any) {

    this.codecPersonalVinc = data.codPersonal;

    this.personalVinculacionForm
        .controls['cedula'].setValue(data.cedula);
    this.personalVinculacionForm
        .controls['nombrePersonal'].setValue(data.personaNombre);
    this.personalVinculacionForm
        .controls['edad'].setValue(data.edad);
    this.personalVinculacionForm
        .controls['email'].setValue(data.correoInstitucional);
    this.personalVinculacionForm
        .controls['emailPers'].setValue(data.correoPersonal);
    this.personalVinculacionForm
        .controls['idProvincia'].setValue(data.idCanton);
    this.personalVinculacionForm
        .controls['idCanton'].setValue(data.idCanton);
    this.personalVinculacionForm
        .controls['direccion'].setValue(data.direccion);
    this.personalVinculacionForm
        .controls['celular'].setValue(data.telefonoCelular);
    this.personalVinculacionForm
        .controls['telCasa'].setValue(data.telefonoCasa);
    this.personalVinculacionForm
        .controls['sexo'].setValue(data.codSexo);
    this.personalVinculacionForm
        .controls['tipo'].setValue(data.tipo);
    this.personalVinculacionForm
        .controls['facultad'].setValue(data.codFacultad);
    this.personalVinculacionForm
        .controls['carrera'].setValue(data.codCarrera)
    this.personalVinculacionForm
        .controls['idInstituto'].setValue(data.codCarrera)
    this._icon = 'sync_alt';
    this.textButton = 'Editar';
    this._cancel = true;

  }

  public _cancel: boolean = false;
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator = this.paginator;
  }

  public personalListaVinc: any = [];
  obtenerPersonalVinculacion() {
    this.personal.obtenerPersonalVinculacion(this.codCia).subscribe(
      {
        next: (x) => {
          this.personalListaVinc = x;
          console.warn(this.personalListaVinc);
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
          this.dataSource = new MatTableDataSource(this.personalListaVinc);
          this.dataSource.paginator = this.paginator;
        }
      }
    )
  }

  getDataMaster(cod:string) {
    this.DataMaster.getDataMaster(cod).subscribe({
      next: (Data) => {

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

  crearCuentaDeAlumno(codPersonal: string) {
    this.registrarAlumno.createAccountAlumo(2, codPersonal).subscribe( {
      next: () => {
        console.log('cuenta creada');
      }, error: (e) => {
        console.error(e)
      }
    })
  }

  createCodec(): string {
    var xcod: string =  'PV-'+this.token.generateRandomString(6) + '-'+ this.personalVinculacionForm.controls['cedula'].value
    return xcod;
  }

  public personalVinculacionLista: any = [];
  plista: any = [];
  public codigoPersonalcreado: string = '';
  guardarPersonal() {

    if( this.personalVinculacionForm.controls['nombrePersonal'].value == '' ||
        this.personalVinculacionForm.controls['nombrePersonal'].value == undefined ||
        this.personalVinculacionForm.controls['nombrePersonal'].value == null ) Toast.fire({ icon: 'warning', title: 'El nombre no puede estar vacío...' })

    else if( this.personalVinculacionForm.controls['cedula'].value == '' ||
        this.personalVinculacionForm.controls['cedula'].value == undefined ||
        this.personalVinculacionForm.controls['cedula'].value == null ) Toast.fire({ icon: 'warning', title: 'La cédula no puede estar vacía...' })

    else if( this.personalVinculacionForm.controls['email'].value == '' ||
        this.personalVinculacionForm.controls['email'].value == undefined ||
        this.personalVinculacionForm.controls['email'].value == null ) Toast.fire({ icon: 'warning', title: 'El correo institucional no puede estar vacío...' })

    else if( this.personalVinculacionForm.controls['tipo'].value == '' ||
        this.personalVinculacionForm.controls['tipo'].value == undefined ||
        this.personalVinculacionForm.controls['tipo'].value == null ) Toast.fire({ icon: 'warning', title: 'El tipo de personal no puede estar vacío...' })


    else {
      let codec: string = this.createCodec();
      this.personalVinculacionLista = {
        "codPersonal":          codec,
        "personaNombre":        this.personalVinculacionForm.controls['nombrePersonal'].value,
        "fechaCreacion":        new Date().toISOString(),
        "fechaMod":             new Date().toISOString(),
        "edad":                 this.personalVinculacionForm.controls['edad'].value,
        "correoInstitucional":  this.personalVinculacionForm.controls['email'].value,
        "correoPersonal":       this.personalVinculacionForm.controls['emailPers'].value,
        "codFacultad":          this.personalVinculacionForm.controls['facultad'].value,
        "codCarrera":           this.personalVinculacionForm.controls['carrera'].value,
        "semestreNivel": "",
        "idCanton":             this.personalVinculacionForm.controls['idCanton'].value,
        "idProvincia":          this.personalVinculacionForm.controls['idProvincia'].value,
        "direccion":            this.personalVinculacionForm.controls['direccion'].value,
        "telefonoCelular":      this.personalVinculacionForm.controls['celular'].value,
        "telefonoCasa":         this.personalVinculacionForm.controls['telCasa'].value,
        "codcia":               this.codCia,
        "codSexo":              this.personalVinculacionForm.controls['sexo'].value,
        "tipo":                 this.personalVinculacionForm.controls['tipo'].value,
        "cedula":               this.personalVinculacionForm.controls['cedula'].value,
        "idInstituto":          this.personalVinculacionForm.controls['idInstituto'].value
      }

      console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      console.warn(this.personalVinculacionLista)
      console.warn('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

      this.personal.guardarPersonalVinculacion(this.personalVinculacionLista).subscribe ( {

        next: (personal) => {
          Toast.fire({ icon: 'success', title: 'Personal de vinculación ha sido creado...' });
          console.log(personal);
          this.plista = personal; 
          this.codigoPersonalcreado = this.plista.codPersonal    
        },
        error: (error) => {
          console.log(error);
          Toast.fire({ icon: 'error', title: 'Personal de vinculación no ha sido creado...' })
        }, complete: () => {
          this.crearCuentaDeAlumno(this.codigoPersonalcreado);
          this.obtenerPersonalVinculacion();
          this.limpiar();
        }

      })

    }

  }

  eliminarEntidad(codUser: string) {

    Swal.fire({
      title: 'Estas seguro?',
      text: "Esta entidad esta asociada a otros procesos!",
      icon: 'warning',
      footer: 'ACCIÓN IRREVERSIBLE',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.loginService.eliminarEntidades(codUser).subscribe({
          next: (x) => {
            Swal.fire(
              'Eliminado!',
              'Esta entidad ha sido eliminada.',
              'success'
            )
          }, error: (e) => {
            Swal.fire(
              'Deleted!',
              'No hemos podido borrar.',
              'error'
            )
          }, complete: () => {
            this.obtenerPersonalVinculacion();
          }
        })
      }
    })

  }

  validacionContraparte() {
    if( this.personalVinculacionForm.controls['tipo'].value == '004' ) {
      this._showInstituciones = true;
      this.obtenerIntitutos()
    } else {
      this._showInstituciones = false;
    }
  }

  public _showInstituciones: boolean = false;
  public listadeInstitutosObtenidos: any = []
  obtenerIntitutos() {
    this.institutos.obtenerInstitutos(this.codCia).subscribe({
      next: (institutos) => {
        this.listadeInstitutosObtenidos = institutos;
        console.log(this.listadeInstitutosObtenidos)
      },
      error: (e) => {
        console.error(e);
      }
      // complete: () => {
      //   this.dataSource = new MatTableDataSource(this.listadeInstitutosObtenidos);
      //   this.dataSource.paginator = this.paginator;
      // }
    })
  }

  public codecPersonalVinc: string = '';
  actualizarPersonal() {
    if( this.personalVinculacionForm.controls['nombrePersonal'].value == '' ||
        this.personalVinculacionForm.controls['nombrePersonal'].value == undefined ||
        this.personalVinculacionForm.controls['nombrePersonal'].value == null ) Toast.fire({ icon: 'warning', title: 'El nombre no puede estar vacío...' })

    else if( this.personalVinculacionForm.controls['cedula'].value == '' ||
        this.personalVinculacionForm.controls['cedula'].value == undefined ||
        this.personalVinculacionForm.controls['cedula'].value == null ) Toast.fire({ icon: 'warning', title: 'La cédula no puede estar vacía...' })

    else if( this.personalVinculacionForm.controls['email'].value == '' ||
        this.personalVinculacionForm.controls['email'].value == undefined ||
        this.personalVinculacionForm.controls['email'].value == null ) Toast.fire({ icon: 'warning', title: 'El correo institucional no puede estar vacío...' })

    else if( this.personalVinculacionForm.controls['tipo'].value == '' ||
        this.personalVinculacionForm.controls['tipo'].value == undefined ||
        this.personalVinculacionForm.controls['tipo'].value == null ) Toast.fire({ icon: 'warning', title: 'El tipo de personal no puede estar vacío...' })


    else {
    this.personalVinculacionLista = {
      "codPersonal":          this.codecPersonalVinc,
      "personaNombre":        this.personalVinculacionForm.controls['nombrePersonal'].value,
      "fechaCreacion":        new Date().toISOString(),
      "fechaMod":             new Date().toISOString(),
      "edad":                 this.personalVinculacionForm.controls['edad'].value,
      "correoInstitucional":  this.personalVinculacionForm.controls['email'].value,
      "correoPersonal":       this.personalVinculacionForm.controls['emailPers'].value,
      "codFacultad":          this.personalVinculacionForm.controls['facultad'].value,
      "codCarrera":           this.personalVinculacionForm.controls['carrera'].value,
      "semestreNivel": "",
      "idCanton":             this.personalVinculacionForm.controls['idCanton'].value,
      "idProvincia":          this.personalVinculacionForm.controls['idProvincia'].value,
      "direccion":            this.personalVinculacionForm.controls['direccion'].value,
      "telefonoCelular":      this.personalVinculacionForm.controls['celular'].value,
      "telefonoCasa":         this.personalVinculacionForm.controls['telCasa'].value,
      "codcia":               this.codCia,
      "codSexo":              this.personalVinculacionForm.controls['sexo'].value,
      "tipo":                 this.personalVinculacionForm.controls['tipo'].value,
      "cedula":               this.personalVinculacionForm.controls['cedula'].value,
      "idInstituto":          this.personalVinculacionForm.controls['idInstituto'].value
    }

    console.warn('DATA A ACTUALIZAR')
    console.warn(this.personalVinculacionLista)

    this.personal.actualizarPersonal(this.codecPersonalVinc, this.personalVinculacionLista).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Personal de vinculación ha sido actualizado...' });
      },
      error: (e) => {
        Toast.fire({ icon: 'error', title: 'Algo ha salido mal con la actualización...' });
      },
      complete: () => {
        this.obtenerPersonalVinculacion();
        this.limpiar();
      }

    })
  }
  }

  limpiar() {
    this.personalVinculacionForm
        .controls['cedula'].setValue('');
    this.personalVinculacionForm
        .controls['nombrePersonal'].setValue('');
    this.personalVinculacionForm
        .controls['edad'].setValue(0);
    this.personalVinculacionForm
        .controls['email'].setValue('');
    this.personalVinculacionForm
        .controls['emailPers'].setValue('');
    this.personalVinculacionForm
        .controls['idProvincia'].setValue('');
    this.personalVinculacionForm
        .controls['idCanton'].setValue('');
    this.personalVinculacionForm
        .controls['direccion'].setValue('');
    this.personalVinculacionForm
        .controls['celular'].setValue('');
    this.personalVinculacionForm
        .controls['telCasa'].setValue('');
    this.personalVinculacionForm
        .controls['sexo'].setValue('');
    this.personalVinculacionForm
        .controls['tipoPers'].setValue('');
    this.personalVinculacionForm
        .controls['facultad'].setValue('');
    this.personalVinculacionForm
        .controls['carrera'].setValue('');
        this._icon      = 'add';
        this.textButton = 'Crear';
        this._cancel    = false;
  }

}
