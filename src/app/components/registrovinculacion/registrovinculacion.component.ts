import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/services/login.service';
import { Router } from '@angular/router';
import { RegistroAlumnoService } from './registrovinculacionServices/registro-alumno.service';
import { SharedServicesService } from '../shared/services-shared/shared-services.service';
import { TokenService } from '../shared/services-shared/token.service';
import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment.prod';
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
  selector: 'app-registrovinculacion',
  templateUrl: './registrovinculacion.component.html',
  styleUrls: ['./registrovinculacion.component.scss']
})
export class RegistrovinculacionComponent implements OnInit {

  public sexoLista:        any = [];
  public provinciaLista:   any = [];
  public estadoCivilLista: any = [];
  public carrerasLista:    any = [];
  public cursoLista:       any = [];
  public disabledbutton:   boolean = true;
  public messageText:      string = '';
  public esValida:         boolean   = false;
  
  
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

  constructor( public token: TokenService, public shared: SharedServicesService , public general: GeneralService,
               public router: Router, public DataMaster: RegistroAlumnoService ) { }

  ngOnInit(): void {
        // this.getDataMaster('R13');
        // 
        this.getDataMaster('CCU');
        // PROVINCIAS
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
        // Capacidad
        this.getDataMaster('CPAD');

        this.getCia();

  }

  public facultadLista: any = []
  tipoPersonaLista: any = [];


  semestreLista: any = [
    // {
    //   nivel: 1,
    // },
    // {
    //   nivel: 2,
    // },
    // {
    //   nivel: 3,
    // },
    // {
    //   nivel: 4,
    // },
    // {
    //   nivel: 5,
    // },
    // {
    //   nivel: 6,
    // },
    {
      nivel: 7,
    },
    
    {
      nivel: 8,
    },
    
    {
      nivel: 9,
    },
    
    {
      nivel: 10,
    },
    ]


  public alumnoForm = new FormGroup({
    alumnoNombre:  new FormControl( '', [ Validators.required ]),
    sexo:          new FormControl( '' ),
    estadoCivil:   new FormControl( '' ),
    cedula:        new FormControl( '', [ Validators.required ]),
    edad:    new FormControl( 0 ),
    correoInstitu: new FormControl( '', [ Validators.required, Validators.email ]),
    correoPerson:  new FormControl( '', [ Validators.email ]),
    facultad:      new FormControl( '', [ Validators.required ]),
    carrera:       new FormControl( '', [ Validators.required ]),
    pais:          new FormControl( '', [ Validators.required ]),
    provincia:     new FormControl( '', [ Validators.required ]),
    canton:        new FormControl( '', [ Validators.required ]),
    direccion:     new FormControl( ''),
    tCelular:      new FormControl( '', [ Validators.required ]),
    tCasa:         new FormControl( '' ),
    codCurso:      new FormControl( '' ),
    semestre:      new FormControl( '', [ Validators.required ] ),
    capacidad:     new FormControl( '', [ Validators.required ] )
  });

  public capacidadLista: any = [];
  public cantonLista:    any = [];
  getCantones( codProvincia: string ) {
    this.DataMaster.getDataMaster(codProvincia).subscribe({
      next: (cantones) => {
        this.cantonLista = cantones;
        console.warn( this.cantonLista );
      }, 
      error: (e) => {
        console.error(e);
      }
    })
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
          case 'CCU':
            this.cursoLista = Data;
            console.log('CURSO LISTA')
            console.log(this.cursoLista)
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
          case 'CPAD':
            this.capacidadLista = Data;
            console.log('this.capacidadLista')
            console.log(this.capacidadLista)
            break;
        }

      }
    })
  }


  validarCedula(): void {
    this.esValida = this.validarCedulaEc(this.alumnoForm.controls['cedula'].value);
    let textoVal = ''
    if( this.esValida ) {
      textoVal = ' es válida';
    }
    else {
      textoVal = ' no es válida';
    }
    this.messageText = `La cédula ${this.alumnoForm.controls['cedula'].value} ${textoVal}`;
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


  salir () {
    this.router.navigate(['/ingreso'])
  }

  crearCuentaDeAlumno(codAlumno: string) {
    this.DataMaster.createAccountAlumo(1, codAlumno).subscribe( x => {
      console.log('cuenta creada');
    })
  }

  public alumnoLista: any = [];
  onSubmit() {

    if( 
      (this.alumnoForm.controls['alumnoNombre'].value == '' || this.alumnoForm.controls['alumnoNombre'].value == null || this.alumnoForm.controls['alumnoNombre'].value == undefined )
      ||
      (this.alumnoForm.controls['cedula'].value == '' || this.alumnoForm.controls['cedula'].value == null || this.alumnoForm.controls['cedula'].value == undefined )
      ||
      (this.alumnoForm.controls['edad'].value == '' || this.alumnoForm.controls['edad'].value == null || this.alumnoForm.controls['edad'].value == undefined )
      ||
      (this.alumnoForm.controls['carrera'].value == '' || this.alumnoForm.controls['carrera'].value == null || this.alumnoForm.controls['carrera'].value == undefined )
      ||
      (this.alumnoForm.controls['semestre'].value == '' || this.alumnoForm.controls['semestre'].value == null || this.alumnoForm.controls['semestre'].value == undefined )
      ||
      (this.alumnoForm.controls['facultad'].value == '' || this.alumnoForm.controls['facultad'].value == null || this.alumnoForm.controls['facultad'].value == undefined )
    ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campos sin rellenar...'
      })
    } else if ( !this.esValida ) {
      
      Toast.fire({
        icon: 'error',
        title: 'Número de cédula incorrecto...'
      })

    }
    else {
      console.warn(this.codCia);
      let x: any = 'AL-'+this.token.generateRandomString(6) + '-'+ this.alumnoForm.controls['cedula'].value;
      this.alumnoLista =
      {
        alumnoNombre: this.alumnoForm.controls['alumnoNombre'].value,
        codAlumno:    x,
        fechaMod: new Date(),
        cedula: this.alumnoForm.controls['cedula'].value,
        edad: this.alumnoForm.controls['edad'].value,
        correoInstitucional: this.alumnoForm.controls['correoInstitu'].value,
        correoPersonal: this.alumnoForm.controls['correoPerson'].value,
        codFacultad: this.alumnoForm.controls['facultad'].value,
        codCarrera: this.alumnoForm.controls['carrera'].value,
        semestreNivel: this.alumnoForm.controls['semestre'].value,
        idProvincia: this.alumnoForm.controls['provincia'].value,
        idCanton: this.alumnoForm.controls['canton'].value,
        direccion: this.alumnoForm.controls['direccion'].value,
        telefonoCelular: this.alumnoForm.controls['tCelular'].value,
        telefonoCasa: this.alumnoForm.controls['tCasa'].value,
        codCia: this.codCia,
        codSexo: this.alumnoForm.controls['sexo'].value,
        codCurso:this.alumnoForm.controls['codCurso'].value,
        capacidades:this.alumnoForm.controls['capacidad'].value
      }
    console.warn(this.alumnoLista);
    this.DataMaster.guardarAlumno(this.alumnoLista).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Te has unido a la vinculación'
        })
      }, error: () => {
        Toast.fire({
          icon: 'error',
          title: 'Ups! Algo ha pasado... (ERROR: #001)'
        })
      }, complete: () => {
        this.crearCuentaDeAlumno(x);
        this.router.navigate(['/ingreso'])
      }
    })
  }
  }



}
