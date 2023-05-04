import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { EstudiantesService } from './services/estudiantes.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroAlumnoService } from '../../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { TokenService } from '../../shared/services-shared/token.service';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment.prod';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from '../../login/services/login.service';
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
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.scss']
})
export class EstudiantesComponent implements OnInit {

  @ViewChild('editDom')
  editDom!: ElementRef;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

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
  
  constructor(  public token: TokenService, 
                public loginService: LoginService,
                public general: GeneralService,
                public registrarAlumno: RegistroAlumnoService,
                public shared: SharedServicesService,
                private alumnos: EstudiantesService ) { }

  public alumnosLista:  any     = '';
  public _edit:         boolean = false;
  public _action:       string  = 'Crear';
  public codAl:         string  = '';
  public fechaCreacion: string  = '';
  public _icon_action:  string  = 'add';

  columnHead: any = [ 'edit', 'Capacidades', 'Nombres', 'Curso', 'Edad',  'Fecha Registro', 'Cédula', 'Dirección', 'Correo Inst.' ];

  panelOpenState = false;

  public dataSource!: MatTableDataSource<any>;
  public dataSourceGrupos!: MatTableDataSource<any>;

  public alumnoForm = new FormGroup({
    alumnoNombre:  new FormControl( '', [ Validators.required ]),
    cedula:        new FormControl( '', [ Validators.required ]),
    email:         new FormControl( '', [ Validators.required, Validators.email ]),
    curso:         new FormControl( '' ),
  });

  public grupoForm = new FormGroup ({
    nombreGrupo: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.getUsers();
    this.getCia();
  }

  onSubmit() {
    this.registrorapidoAlumno(this._action);
  }

  public alumnoLista: any = [];

  createCodec(): string {
    var xcod: string =  'AL-'+this.token.generateRandomString(6) + '-'+ this.alumnoForm.controls['cedula'].value
    return xcod;
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
            this.getUsers();
          }
        })
      }
    })

  }

  registrorapidoAlumno(type: string) {

    const codecUser = this.createCodec(); 

    if(  ( this.alumnoForm.controls['alumnoNombre'].value == '' || this.alumnoForm.controls['alumnoNombre'].value == null || this.alumnoForm.controls['alumnoNombre'].value == undefined )
        || ( this.alumnoForm.controls['email'].value == '' || this.alumnoForm.controls['email'].value == null || this.alumnoForm.controls['email'].value == undefined )  
        || ( this.alumnoForm.controls['alumnoNombre'].value == '' || this.alumnoForm.controls['alumnoNombre'].value == null || this.alumnoForm.controls['alumnoNombre'].value == undefined )  
    ) {
        Toast.fire({
          icon: 'warning',
          title: 'Campos sin rellenar...'
        })
    } 
    else {
    console.warn(this.alumnoLista);

    switch( type ) {
      case 'Crear':
        this.alumnoLista = {
          "alumnoNombre":  this.alumnoForm.controls['alumnoNombre'].value,
          "codAlumno":     codecUser,
          "fechaMod":      new Date().toISOString(),
          "cedula":        this.alumnoForm.controls['cedula'].value,
          "edad":          0,
          "correoInstitucional": this.alumnoForm.controls['email'].value,
          "correoPersonal":      this.alumnoForm.controls['email'].value,
          "codCia":         this.codCia,
          "codCurso":          this.alumnoForm.controls['curso'].value
        }

      this.registrarAlumno.guardarAlumno(this.alumnoLista).subscribe({
          next: (x) => {
            Toast.fire({
              icon: 'success',
              title: 'Estudiante ha sido vinculado, de manera rápida...'
            })
          }, error: () => {
            Toast.fire({
              icon: 'error',
              title: 'Ups! Algo ha pasado... (ERROR: #002)'
            })
          }, complete: () => {
            this.crearCuenta(codecUser);
            // console.log(this.dataSource);
            this.alumnosLista.unshift(this.alumnoLista)
            this.dataSource = new MatTableDataSource(this.alumnosLista);
          }
        })
        break;
      case 'Editar':
        this.alumnoLista = {

          "alumnoNombre":  this.alumnoForm.controls['alumnoNombre'].value,
          "codAlumno":     this.codAl,
          "fechaCreacion": this.fechaCreacion,
          "fechaMod":      new Date().toISOString(),
          "cedula":        this.alumnoForm.controls['cedula'].value,
          "edad":          0,
          "correoInstitucional": this.alumnoForm.controls['email'].value,
          "correoPersonal":      this.alumnoForm.controls['email'].value,
          "codCia":         this.codCia,
          "codCurso":          this.alumnoForm.controls['curso'].value
        }

        this.alumnos.actualizarAlumnosVinculacion(this.codAl, this.alumnoLista).subscribe(
          {
            next: (x) => {
              console.log('Estudiante editado');
              Toast.fire({
                icon: 'success',
                title: 'Estudiante ha sido editado, de manera rápida...'
              })
            }, 
            error: (error) => {
              Toast.fire({
                icon: 'error',
                title: 'Ups! Algo ha pasado... (ERROR: #003)'
              })
              console.error(error);
            }, 
            complete: () => {

              console.warn(this.dataSource.filteredData)

              this.dataSource.filteredData.find( ( alumno:any ) => {
                if( alumno.codAlumno == this.codAl ) {
                  alumno.alumnoNombre        = this.alumnoForm.controls['alumnoNombre'].value;
                  alumno.cedula              = this.alumnoForm.controls['cedula'].value;
                  alumno.correoInstitucional = this.alumnoForm.controls['email'].value;
                }
              })

              this.limpiarInputs();
              this._edit = false;

            }
          }
        )

        break;
    }
    }
  }

  
  editarAlumno( curso: string, cedula: string, nombres: string, email: string, codAlumno: string, fechCreacion: string )
  {
    this.fechaCreacion = fechCreacion;
    this.codAl = codAlumno;
    this._edit =  true;
    this.alumnoForm.controls['alumnoNombre'].setValue(nombres);
    this.alumnoForm.controls['cedula'].setValue(cedula);
    this.alumnoForm.controls['email'].setValue(email);
    this.alumnoForm.controls['curso'].setValue(curso);
    this._action = 'Editar';
    this._icon_action = 'sync_alt';
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  calcularMiEdad(date: string): number {
    const miFechaDeNacimiento = new Date(date); // Reemplaza esto con tu fecha de nacimiento
    console.warn(miFechaDeNacimiento)
    const miEdad = this.shared.calcularEdad(miFechaDeNacimiento);
    return miEdad;
  }


  getUsers() {
    this.alumnos.obtenerAlumnosVinculacion(this.codCia)
                .subscribe( alumnos => {
                this.alumnosLista = alumnos;
                console.log('Alumnos');
                console.log(this.alumnosLista);
                this.dataSource = new MatTableDataSource(this.alumnosLista);
                this.dataSource.paginator = this.paginator;
    }) 
  }


  crearCuenta(codAlumno:string) {
    this.registrarAlumno.createAccountAlumo(1, codAlumno).subscribe( procedure => {
      Toast.fire({
        icon: 'success',
        title: 'Se ha generado una cuenta de usuario para este Alumno...'
      })
      this.limpiarInputs();
      this._edit = false;
    }, (error) => {
      Toast.fire({
        icon: 'error',
        title: 'Algo ha pasado con las cuentas... Error #103'
      })
    })
  }

  public messageText: string = '';
  public esValida: boolean = false;
  validarCedula(): void {
    this.esValida = this.validarCedulaEc(this.alumnoForm.controls['cedula'].value);
    console.warn(this.esValida);
    
    let textoVal = '';

    if( this.esValida ) {
      textoVal = ' es válida';
    }
    else {
      textoVal = ' no es válida';
    }
    this.messageText = `La cédula ${this.alumnoForm.controls['cedula'].value} ${textoVal}`;
  }

  limpiarInputs() {
    this.alumnoForm.controls['alumnoNombre'].setValue('');
    this.alumnoForm.controls['cedula'].setValue('');
    this.alumnoForm.controls['email'].setValue('');
  }

  private validarCedulaEc(cedula: string): boolean {
    
      if (cedula.length !== 10) {
        return false;
      }
      
      const digitoRegion = Number(cedula.substring(0, 2));
      if (digitoRegion < 1 || digitoRegion > 24) {
        return false;
      }
      
      const tercerDigito = Number(cedula.charAt(2));
      if (tercerDigito < 0 || tercerDigito > 6) {
        return false;
      }
      
      let suma = 0;
      let coeficiente = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      
      for (let i = 0; i < coeficiente.length; i++) {
        let multiplicacion = coeficiente[i] * Number(cedula.charAt(i));
        if (multiplicacion >= 10) {
          multiplicacion -= 9;
        }
        suma += multiplicacion;
      }
      
      const ultimoDigito = Number(cedula.charAt(9));
      const digitoverificador = (10 - (suma % 10)) % 10;
      
      return ultimoDigito === digitoverificador;   
  
  }

}
