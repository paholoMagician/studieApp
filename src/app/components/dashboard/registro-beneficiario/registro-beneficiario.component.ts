import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { TokenService } from '../../shared/services-shared/token.service';
import { RegistroAlumnoService } from '../../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { PersonalVinculacionService } from '../personal-vinculacion/services/personal-vinculacion.service';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProyectosService } from '../generar-proyectos/services/proyectos.service';
import { environment } from 'src/environments/environment.prod';
import { ProcesosService } from '../procesos/procesos-services/procesos.service';
import { BeneficiariosService } from './beneficiarios.service';
import { MatTableDataSource } from '@angular/material/table';
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
  selector: 'app-registro-beneficiario',
  templateUrl: './registro-beneficiario.component.html',
  styleUrls: ['./registro-beneficiario.component.scss']
})
export class RegistroBeneficiarioComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public sexoLista:        any = [];
  public provinciaLista:   any = [];
  public estadoCivilLista: any = [];
  public tipoPersonaLista: any = [];
  public carrerasLista:    any = [];
  public facultadLista:    any = [];
  public jornadaLista:    any = [];

  _icon: string = 'add';
  public _cancel: boolean = false;

  public codCia = environment.codCia; 
  public dataSource!: MatTableDataSource<any>;
  // 'direccion', 'ciudad',
  columnHead: any = [ 'edit', 'Nombre Proyecto', 'Nombre Benficiario',   'edad', 'C. Representante', 'Jornada'  ];
  // 'tema_1', 'Dia 1', 'tema_2', 'Dia 2'

  constructor( public token:           TokenService,
               public proceso:         ProcesosService,
               private beneficiarios:  BeneficiariosService,
               public registrarAlumno: RegistroAlumnoService, 
               public proyecto:        ProyectosService,
               public personal:        PersonalVinculacionService,
               public DataMaster:      SharedServicesService ) { }

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
    // jornada
    this.getDataMaster('JO01');
    // DIAS DE LA SEMANA
    // this.getDataMaster('D-00');

    let xuser:any = sessionStorage.getItem('email');
    this.beneficiarioVinculacionForm.controls['usercod'].setValue(xuser); 

    this.obtenerProyectos();
    this.obtenerBeneficiarios();

  }




  public beneficiarioVinculacionForm = new FormGroup({
    idProyecto:       new FormControl( '', [ Validators.required ]),
    idProcesos:       new FormControl( '', [ Validators.required ]),
    cedula:           new FormControl( '', [ Validators.required ]),
    nombrePersonal:   new FormControl( '', [ Validators.required ]),
    email:            new FormControl( '', [ Validators.required ]),
    edad:             new FormControl( '', [ Validators.required ]),
    sexo:             new FormControl( '', [ Validators.required ]),
    canton:           new FormControl( '', [ Validators.required ]),
    direccion:        new FormControl( '', [ Validators.required ]),
    celular:          new FormControl( '', [ Validators.required ]),
    jornada:          new FormControl( '', [ Validators.required ]),
    usercod:          new FormControl( '', [ Validators.required ]),
    tema1:            new FormControl( '', [ Validators.required ]),
    dia1:             new FormControl( '', [ Validators.required ]),
    tema2:            new FormControl( '', [ Validators.required ]),
    dia2:             new FormControl( '', [ Validators.required ]),
    cedulaRepre:      new FormControl( '', [ Validators.required ]),
  });

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public textButton= 'Crear'
   onSubmit() { 
    switch( this.textButton ) {
      case 'Crear':
        this.guardarBeneficiario();
        break;
      case 'Actualizar':
        this.editarBeneficiario();
        break;
    }
  }
  
  public codBeneficiario: string = '';
  catchData( data: any ) {
    console.log(data);

    this._cancel = true;
    this.textButton = 'Actualizar';
    this._icon = 'sync_alt';

    this.codBeneficiario = data.cedBeneficiario;

    console.warn('COD BENEFICIARIO');
    console.warn(this.codBeneficiario);
    

    this.beneficiarioVinculacionForm.controls['nombrePersonal'].setValue(data.nombreBeneficiario);
    this.beneficiarioVinculacionForm.controls['email'].setValue(data.email);
    this.beneficiarioVinculacionForm.controls['direccion'].setValue(data.direccion);
    this.beneficiarioVinculacionForm.controls['canton'].setValue(data.idCanton);
    this.beneficiarioVinculacionForm.controls['edad'].setValue(data.edad);
    this.beneficiarioVinculacionForm.controls['cedulaRepre'].setValue(data.cedRepresentante);
    this.beneficiarioVinculacionForm.controls['jornada'].setValue(data.idJornada);
    this.beneficiarioVinculacionForm.controls['tema1'].setValue(data.tema_1);
    this.beneficiarioVinculacionForm.controls['tema2'].setValue(data.tema_2);
    this.beneficiarioVinculacionForm.controls['idProcesos'].setValue(data.idProcesos);
    this.beneficiarioVinculacionForm.controls['idProyecto'].setValue(data.idProyecto);
    this.obtenerProcesosPorProyectos()
    this.beneficiarioVinculacionForm.controls['dia1'].setValue(data.codDay1);
    this.beneficiarioVinculacionForm.controls['dia2'].setValue(data.codDay2);
    this.beneficiarioVinculacionForm.controls['cedula'].setValue(data.cedulaBeneficiario);
    this.beneficiarioVinculacionForm.controls['sexo'].setValue(data.codSexo);
    this.beneficiarioVinculacionForm.controls['celular'].setValue(data.telfCelular);
   }

   editarBeneficiario() {
    if (this.beneficiarioVinculacionForm.controls['nombrePersonal'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campo Nombre Beneficiario vacío...'
      })
    }
    else if ( this.beneficiarioVinculacionForm.controls['email'].value == '' ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campo Email vacío...'
      })
    }
    else if (this.beneficiarioVinculacionForm.controls['direccion'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campo Dirección vacío...'
      })
    }
    else if (this.beneficiarioVinculacionForm.controls['canton'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Cantón vacío...'
      })
    }
    else if (this.beneficiarioVinculacionForm.controls['edad'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos edad vacío...'
      })
    }
    // else if (this.beneficiarioVinculacionForm.controls['cedulaRepre'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Cédula Representante vacío...'
    //   })
    // }
    else if (this.beneficiarioVinculacionForm.controls['jornada'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Jornada vacío...'
      })
    }
    // else if (this.beneficiarioVinculacionForm.controls['tema1'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Tema 1 vacío...'
    //   })
    // }
    // else if (this.beneficiarioVinculacionForm.controls['tema2'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Tema 2 vacío...'
    //   })
    // }
    else if (this.beneficiarioVinculacionForm.controls['idProcesos'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Proceso vacío...'
      })
    }
    else if ( this.beneficiarioVinculacionForm.controls['idProyecto'].value == '' ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Proyecto vacío...'
      })
    }
    // else if (this.beneficiarioVinculacionForm.controls['dia1'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Día 1 vacío...'
    //   })
    // }
    // else if ( this.beneficiarioVinculacionForm.controls['dia2'].value == '' ) {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Día 2 vacío...'
    //   })
    // }
    else if (this.beneficiarioVinculacionForm.controls['cedula'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos cédula vacío...'
      })
    }
    else {

    let xuser:any = sessionStorage.getItem('UserCod');   

    this.beneficiario =
    {
      "cedBeneficiario":        this.codBeneficiario,
      "nombreBeneficiario":     this.beneficiarioVinculacionForm.controls['nombrePersonal'].value,
      "email":                  this.beneficiarioVinculacionForm.controls['email'].value,
      "direccion":              this.beneficiarioVinculacionForm.controls['direccion'].value,
      "idCanton":               this.beneficiarioVinculacionForm.controls['canton'].value,
      "edad":                   this.beneficiarioVinculacionForm.controls['edad'].value,
      "cedRepresentante":       this.beneficiarioVinculacionForm.controls['cedulaRepre'].value,
      "idJornada":              this.beneficiarioVinculacionForm.controls['jornada'].value,
      "tema1":                  this.beneficiarioVinculacionForm.controls['tema1'].value,
      "tema2":                  this.beneficiarioVinculacionForm.controls['tema2'].value,
      "tema3": "---",
      "idUserRegister": xuser,
      "idProcesos":             this.beneficiarioVinculacionForm.controls['idProcesos'].value,
      "idProyecto":             this.beneficiarioVinculacionForm.controls['idProyecto'].value,
      "institucionNombre": "",
      "ccia": this.codCia,
      "codDay1":                  this.beneficiarioVinculacionForm.controls['dia1'].value,
      "codDay2":                  this.beneficiarioVinculacionForm.controls['dia2'].value,
      "cedulaBeneficiario":       this.beneficiarioVinculacionForm.controls['cedula'].value,
      "codSexo":                  this.beneficiarioVinculacionForm.controls['sexo'].value,
      "telfCelular":              this.beneficiarioVinculacionForm.controls['celular'].value
    }

    console.log('-----------------------------')
    console.log('BENEFICIARIO A EDITAR')
    console.log(this.beneficiario)
    console.log('-----------------------------')

    this.beneficiarios.actualizarBeneficiario( this.codBeneficiario, this.beneficiario).subscribe({
      next: (x) => {
        console.log(x);
        Toast.fire({
          icon: 'success',
          title: 'Beneficiario ha sido creado...'
        })
      },
      error: (e) => {
        console.error(e);
        Toast.fire({
          icon: 'error',
          title: 'Beneficiario no ha sido creado...'
        })
      },
      complete: () => {
        this.obtenerBeneficiarios();
        this._cancel = false;
        this.limpiar();
      }
    })
    }
   }

   eliminarProceso(idBeneficiario: string) {
    this.beneficiarios.eliminarBeneficiario(idBeneficiario).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Beneficiario ha sido eliminado...'
        })
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.obtenerBeneficiarios();
      } 
    })
   }

   listaBeneficiarios: any = [];
   obtenerBeneficiarios() {
    this.beneficiarios.obtenerBeneficiarios(this.codCia).subscribe({
      next: (beneficiario) => {
        console.log(beneficiario);
        this.listaBeneficiarios = beneficiario;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource(this.listaBeneficiarios);
        this.dataSource.paginator = this.paginator;
      }
    })
   }

  public listaProcesos: any = [];
  public optionValue: string = '';

  obtenerProcesosPorProyectos() {

    console.warn(this.beneficiarioVinculacionForm.controls['idProyecto'].value)

    this.beneficiarios.getProcesos(this.codCia, this.beneficiarioVinculacionForm.controls['idProyecto'].value)
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

  limpiar() {
    this.beneficiarioVinculacionForm.controls['nombrePersonal'].setValue('');
    this.beneficiarioVinculacionForm.controls['email'].setValue('');
    this.beneficiarioVinculacionForm.controls['direccion'].setValue('');
    this.beneficiarioVinculacionForm.controls['canton'].setValue('');
    this.beneficiarioVinculacionForm.controls['edad'].setValue('');
    this.beneficiarioVinculacionForm.controls['cedulaRepre'].setValue('');
    this.beneficiarioVinculacionForm.controls['jornada'].setValue('');
    this.beneficiarioVinculacionForm.controls['tema1'].setValue('');
    this.beneficiarioVinculacionForm.controls['tema2'].setValue('');
    this.beneficiarioVinculacionForm.controls['idProcesos'].setValue('');
    this.beneficiarioVinculacionForm.controls['idProyecto'].setValue('');
    this.beneficiarioVinculacionForm.controls['dia1'].setValue('');
    this.beneficiarioVinculacionForm.controls['dia2'].setValue('');
    this.beneficiarioVinculacionForm.controls['cedula'].setValue('');
    this.beneficiarioVinculacionForm.controls['celular'].setValue('');
    this.beneficiarioVinculacionForm.controls['sexo'].setValue('');
    this.textButton = 'Crear';
    this._icon = 'add';
    this._cancel = false;
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
  
  public diasLista: any = [];
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
          case 'JO01':
            this.jornadaLista = Data;
            console.log('Jornada')
            console.log(this.jornadaLista)
            break;
          case 'D-00':
            this.diasLista = Data;
            console.log('DIAS DE LA SEMANA')
            console.log(this.diasLista)
            break;
        }
      }
    })
  }

  public beneficiario: any = [];
  guardarBeneficiario() {

    if (this.beneficiarioVinculacionForm.controls['nombrePersonal'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campo Nombre Beneficiario vacío...'
      })
    }
    else if ( this.beneficiarioVinculacionForm.controls['email'].value == '' ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campo Email vacío...'
      })
    }
    else if (this.beneficiarioVinculacionForm.controls['direccion'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campo Dirección vacío...'
      })
    }
    else if (this.beneficiarioVinculacionForm.controls['canton'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Cantón vacío...'
      })
    }
    else if (this.beneficiarioVinculacionForm.controls['edad'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos edad vacío...'
      })
    }
    // else if (this.beneficiarioVinculacionForm.controls['cedulaRepre'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Cédula Representante vacío...'
    //   })
    // }
    else if (this.beneficiarioVinculacionForm.controls['jornada'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Jornada vacío...'
      })
    }
    // else if (this.beneficiarioVinculacionForm.controls['tema1'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Tema 1 vacío...'
    //   })
    // }
    // else if (this.beneficiarioVinculacionForm.controls['tema2'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Tema 2 vacío...'
    //   })
    // }
    // else if (this.beneficiarioVinculacionForm.controls['idProcesos'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Proceso vacío...'
    //   })
    // }
    else if ( this.beneficiarioVinculacionForm.controls['idProyecto'].value == '' ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campos Proyecto vacío...'
      })
    }
    // else if (this.beneficiarioVinculacionForm.controls['dia1'].value == '') {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Día 1 vacío...'
    //   })
    // }
    // else if ( this.beneficiarioVinculacionForm.controls['dia2'].value == '' ) {
    //   Toast.fire({
    //     icon: 'warning',
    //     title: 'Campos Día 2 vacío...'
    //   })
    // }
    else if (this.beneficiarioVinculacionForm.controls['cedula'].value == '') {
      Toast.fire({
        icon: 'warning',
        title: 'Campos cédula vacío...'
      })
    }
    else {

    let xuser:any = sessionStorage.getItem('UserCod');   

    this.beneficiario =
    {
      "cedBeneficiario":        'BENEF'+this.token.generateRandomString(10),
      "nombreBeneficiario":     this.beneficiarioVinculacionForm.controls['nombrePersonal'].value,
      "email":                  this.beneficiarioVinculacionForm.controls['email'].value,
      "direccion":              this.beneficiarioVinculacionForm.controls['direccion'].value,
      "idCanton":               this.beneficiarioVinculacionForm.controls['canton'].value,
      "edad":                   this.beneficiarioVinculacionForm.controls['edad'].value,
      "cedRepresentante":       this.beneficiarioVinculacionForm.controls['cedulaRepre'].value,
      "idJornada":              this.beneficiarioVinculacionForm.controls['jornada'].value,
      "tema1":                  this.beneficiarioVinculacionForm.controls['tema1'].value,
      "tema2":                  this.beneficiarioVinculacionForm.controls['tema2'].value,
      "tema3": "---",
      "idUserRegister": xuser,
      "idProcesos":             this.beneficiarioVinculacionForm.controls['idProcesos'].value,
      "idProyecto":             this.beneficiarioVinculacionForm.controls['idProyecto'].value,
      "institucionNombre": "",
      "ccia": this.codCia,
      "codDay1":                  this.beneficiarioVinculacionForm.controls['dia1'].value,
      "codDay2":                  this.beneficiarioVinculacionForm.controls['dia2'].value,
      "cedulaBeneficiario":       this.beneficiarioVinculacionForm.controls['cedula'].value,
      "codSexo":                  this.beneficiarioVinculacionForm.controls['sexo'].value,
      "telfCelular":              this.beneficiarioVinculacionForm.controls['celular'].value
    }

    console.log(this.beneficiario)

    this.beneficiarios.guardarBeneficiario(this.beneficiario).subscribe({
      next: (x) => {
        console.log(x);
        Toast.fire({
          icon: 'success',
          title: 'Beneficiario ha sido creado...'
        })
      },
      error: (e) => {
        console.error(e);
        Toast.fire({
          icon: 'error',
          title: 'Beneficiario no ha sido creado...'
        })
      },
      complete: () => {
        this.obtenerBeneficiarios();
        this.limpiar();
      }
    })
    }    
  }



}
