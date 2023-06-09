import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from '../../shared/services-shared/token.service';
import { PersonalVinculacionService } from '../personal-vinculacion/services/personal-vinculacion.service';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';

import Swal from 'sweetalert2'
import { EstudiantesService } from '../estudiantes/services/estudiantes.service';
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
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {
  
  public codCia: string = environment.codCia;

  // getCia() {
  //   this.general.getCia().subscribe({
  //     next: (element:any) => {
  //       console.warn(element);
  //       this.codCia = element[0].codcia;
  //     },
  //     error: (e:any) => {
  //       console.error(e)
  //     },
  //     complete: () => {
  //       console.log(this.codCia);
  //       return this.codCia;
  //     }
  //   })
  // }

  constructor( public personal: PersonalVinculacionService, 
               public general: GeneralService, public estudiante: EstudiantesService,  
               public DataMaster: SharedServicesService ) { }

  public sexoLista:        any = [];
  public provinciaLista:   any = [];
  public estadoCivilLista: any = [];
  public tipoPersonaLista: any = [];
  public carrerasLista:    any = [];
  public facultadLista:    any = [];
  public capacidadesLista: any = [];
  public cursoLista:       any = [];
  public _IMGE:        string     = '';
  public _msj: string = 'Crear';
  public _icon: string = 'add';
  public perfilLista: any = [];
  public _entidad_personal: boolean = false;
  public _entidad_alumno: boolean = false;

  public tipo: string = '';
  public _entidad: string = 'Personal'

  public viewer_inputs: boolean = true;
  public readonly_input: boolean = false;

  public perfilForm = new FormGroup({
    nombrePersonal:  new FormControl( '', [ Validators.required ]),
    cedula:        new FormControl( '', [ Validators.required ]),
    email:         new FormControl( '', [ Validators.required, Validators.email ]),
    emailPers:     new FormControl( '', [ Validators.email ]),
    edad:          new FormControl( 0 ),
    provincia:     new FormControl( '' ),
    canton:        new FormControl( '' ),
    direccion:     new FormControl( '' ),
    celular:       new FormControl( '' ),
    tipPers:       new FormControl( '' ),
    telCasa:       new FormControl( '' ),
    tipoPers:      new FormControl( '' ),
    carrera:       new FormControl( '' ),
    facultad:      new FormControl( '' ),
    sexo:          new FormControl( '' ),
  });

  public alumnoForm = new FormGroup({
    alumnoNombre:           new FormControl( '', [ Validators.required ]),
    // FechaCreacion:          new FormControl( '', [ Validators.required ]),
    // FechaMod:               new FormControl( new Date()),
    cedula:                 new FormControl( '', [ Validators.required ]),
    edad:                   new FormControl( 0, [ Validators.required ]),
    correoInstitucional:    new FormControl( '', [ Validators.required, Validators.email ]),
    correoPersonal:         new FormControl( '', [ Validators.required, Validators.email ]),
    codFacultad:            new FormControl( '' ),
    codCarrera:             new FormControl( '' ),            
    semestreNivel:          new FormControl( '' ),         
    idProvincia:            new FormControl( '' ),              
    idCanton:               new FormControl( '' ),              
    sexo:                   new FormControl( '' ),              
    idParroquia:            new FormControl( '' ),           
    direccion:              new FormControl( '' ),
    telefonoCelular:        new FormControl( '' ),       
    telefonoCasa:           new FormControl( '' ),          
    // CodCia:                
    codSexo:                new FormControl( '' )   ,
    capacidades:            new FormControl( '' ),            
    curso:                  new FormControl( '' ),            
  })

  ngOnInit(): void {

        // this.getCia();

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
        //capacidades
        this.getDataMaster('CPAD');
        //curso
        this.getDataMaster('CCU');

        if (this.codCia == null || this.codCia == undefined || this.codCia == '') this.codCia = 'VOID'
        console.warn(this.codCia);

        let xtipo: any = sessionStorage.getItem('tipo');
        if( xtipo == 'docente' || xtipo == 'ADMIN' || xtipo == 'ADMINISTRADOR' ) {
          this._entidad_alumno   = false;
          this._entidad_personal = true;
          this.tipo = 'personal';
          this._entidad = 'Personal';
        } 
        // else if (xtipo == 'ADMIN' || xtipo == 'ADMINISTRADOR') {
        //   this._entidad_alumno   = false;
        //   this._entidad_personal = true;
        //   this.tipo = 'ADMINISTRADOR';
        //   this._entidad = 'Administrador';
        //   this.viewer_inputs = false;
        //   this.readonly_input = true;
        // }
        else {
          this._entidad_alumno   = true;
          this._entidad_personal = false;
          this.tipo = 'alumno';
          this._entidad = 'Alumno';
        }

        this.obtenerPerfilUsuario(this.tipo);

  }

  onSubmit() {
    this.actualizarPerfil();
  }

  public estudianteLista: any = [];
  editarPerfilAlumno () {
    let x: any = sessionStorage.getItem('UserCod');
    this.estudianteLista = {
      CodAlumno: x,
      alumnoNombre:   this.alumnoForm.controls['alumnoNombre'].value,
      FechaMod: new Date(),
      cedula:                   this.alumnoForm.controls['cedula'].value,                
      edad:                     this.alumnoForm.controls['edad'].value,                   
      correoInstitucional:      this.alumnoForm.controls['correoInstitucional'].value,
      correoPersonal:           this.alumnoForm.controls['correoPersonal'].value,         
      codFacultad:              this.alumnoForm.controls['codFacultad'].value,            
      codCarrera:               this.alumnoForm.controls['codCarrera'].value,             
      semestreNivel:            this.alumnoForm.controls['semestreNivel'].value,          
      idProvincia:              this.alumnoForm.controls['idProvincia'].value,                           
      idCanton:                 this.alumnoForm.controls['idCanton'].value,                           
      direccion:                this.alumnoForm.controls['direccion'].value,              
      telefonoCelular:          this.alumnoForm.controls['telefonoCelular'].value,
      telefonoCasa:             this.alumnoForm.controls['telefonoCasa'].value,           
      CodCia: this.codCia,
      codSexo:                  this.alumnoForm.controls['codSexo'].value,
      capacidades:              this.alumnoForm.controls['capacidades'].value,
      codCurso:                 this.alumnoForm.controls['curso'].value
    }

    console.warn(this.estudianteLista);

    this.estudiante.actualizarAlumnosVinculacion( x, this.estudianteLista ).subscribe({
      next: ( x ) => {
        console.log(x);
        Toast.fire({ icon: 'success', title: 'Perfil del alumno ha sido editado...' }); 
      }, error: (e) => {
        console.error(e);
        Toast.fire({ icon: 'error', title: 'No se ha podido editar este perfil...' }); 
      }
    })
   }

  public imagenLista: any = [];
  obtenerImagen(codUser: string) {
    this.DataMaster.obtenerImagen(codUser, 'PERFIL').subscribe( {
      next: (imagen) => {
        this.imagenLista = imagen;
        // console.warn(this.imagenLista);
        this._IMGE = this.imagenLista[0].imagenContent;   
        // console.warn(this._IMGE);
      }
    })
  }

  public cantonLista:    any = [];
  getCantones() {
    this.DataMaster.getDataMaster(this.alumnoForm.controls['idProvincia'].value).subscribe({
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
          case 'CPAD':
            this.capacidadesLista = Data;
            break;
          case 'CCU':
            this.cursoLista = Data;
            break;
        }
      }
    })
  }

  encodeImageFileAsURL() {
    //console.log('Cargando imagenes');
    const filesSelected: any = document.getElementById('fileUp') as HTMLInputElement;
    const fileId: any = filesSelected.files;
    let base;
    if (fileId.length > 0) {
      const fileToLoad: any = filesSelected[0];
      const fileReader: any = new FileReader();
      fileReader.onload = () => {
        base = fileReader.result;
        // console.log('esta es la base')
        // console.log(base)
      };
      fileReader.onloadend = () => {
        this._IMGE = fileReader.result;
        //console.log(this._IMGE);
        this.saveImagen(this._IMGE);
      };

      fileReader.readAsDataURL(fileId[0]);

    }

  }

  saveImagen(img: string) {
    
    let x: any = sessionStorage.getItem('UserCod');

    this.imagenLista = {
      idImagen     : x,
      tipo         : 'PERFIL',
      ImagenContent: img
    }
          
      this.DataMaster.guardarImagen(this.imagenLista).subscribe(
        {
          next: ( imagen ) => {
            console.log(imagen)
            console.log('imagen guardada')
          }, error: (e) => {
            console.error(e);
            this.editarImagen(x, this.imagenLista);
          }
        }
      )
    
  
  }


  editarImagen(codUser:string, model: any []) {
    this.DataMaster.editarImagen( codUser, model ).subscribe({
      next: ( imagen ) => {
        console.log(imagen);
        console.log('editado');
      }, error: (e) => {
        console.error(e);
      }
    })
  }

  obtenerPerfilUsuario(tipo: string) {

    let x: any = sessionStorage.getItem('UserCod');
    console.log(tipo)
    console.log(x)
    

    console.log(this.codCia)

    this.personal.obtenerPersonal(tipo, x, this.codCia).subscribe( perfil => {
      this.perfilLista = perfil;
      console.warn(this.perfilLista);
      if( tipo == 'personal' )
      {

        console.warn('PARA PINTAR LA INFORMACION DEL PERSONAL')

        this.perfilForm.controls['nombrePersonal'].setValue(this.perfilLista[0].personaNombre);    
        this.perfilForm.controls['edad'].setValue(this.perfilLista[0].edad);
        this.perfilForm.controls['email'].setValue(this.perfilLista[0].correoInstitucional);
        this.perfilForm.controls['emailPers'].setValue(this.perfilLista[0].correoPersonal);
        this.perfilForm.controls['facultad'].setValue(this.perfilLista[0].codFacultad);
        this.perfilForm.controls['carrera'].setValue(this.perfilLista[0].codCarrera);
        
        this.alumnoForm.controls['idProvincia'].setValue(this.perfilLista[0].idProvincia);
        this.getCantones();                       
        this.alumnoForm.controls['idCanton'].setValue(this.perfilLista[0].idCanton);                    
 
        this.perfilForm.controls['direccion'].setValue(this.perfilLista[0].direccion);
        this.perfilForm.controls['celular'].setValue(this.perfilLista[0].telefonoCelular);
        this.perfilForm.controls['telCasa'].setValue(this.perfilLista[0].telefonoCasa);
        this.perfilForm.controls['sexo'].setValue(this.perfilLista[0].codSexo);
        this.perfilForm.controls['tipoPers'].setValue(this.perfilLista[0].tipo);
        this.perfilForm.controls['cedula'].setValue(this.perfilLista[0].cedula);
      } 
      
      else if ( tipo == 'ADMINISTRADOR' ) {
        this.perfilForm.controls['nombrePersonal'].setValue(this.perfilLista[0].personaNombre);    
        this.perfilForm.controls['edad'].setValue(this.perfilLista[0].edad);
        this.perfilForm.controls['email'].setValue(this.perfilLista[0].correoInstitucional);
        this.perfilForm.controls['emailPers'].setValue(this.perfilLista[0].correoPersonal);
        this.perfilForm.controls['facultad'].setValue(this.perfilLista[0].codFacultad);
        this.perfilForm.controls['carrera'].setValue(this.perfilLista[0].codCarrera);
        
        this.alumnoForm.controls['idProvincia'].setValue(this.perfilLista[0].idProvincia);
        this.getCantones();                       
        this.alumnoForm.controls['idCanton'].setValue(this.perfilLista[0].idCanton);                    
 
        this.perfilForm.controls['direccion'].setValue(this.perfilLista[0].direccion);
        this.perfilForm.controls['celular'].setValue(this.perfilLista[0].telefonoCelular);
        this.perfilForm.controls['telCasa'].setValue(this.perfilLista[0].telefonoCasa);
        this.perfilForm.controls['sexo'].setValue(this.perfilLista[0].codSexo);
        this.perfilForm.controls['tipoPers'].setValue(this.perfilLista[0].tipo);
        this.perfilForm.controls['cedula'].setValue(this.perfilLista[0].cedula);
      }

      else {

        // console.warn('PARA PINTAR LA INFORMACION DEL ALUMNO');
        // console.warn('ESTE ES EL CODIGO DE CAPACIDADES')
        // console.warn(this.perfilLista)
        this.alumnoForm.controls['alumnoNombre'].setValue(this.perfilLista[0].alumnoNombre);
        this.alumnoForm.controls['cedula'].setValue(this.perfilLista[0].cedula);                
        this.alumnoForm.controls['edad'].setValue(this.perfilLista[0].edad);                   
        this.alumnoForm.controls['correoInstitucional'].setValue(this.perfilLista[0].correoInstitucional);
        this.alumnoForm.controls['correoPersonal'].setValue(this.perfilLista[0].correoPersonal);         
        this.alumnoForm.controls['codFacultad'].setValue(this.perfilLista[0].codFacultad);            
        this.alumnoForm.controls['codCarrera'].setValue(this.perfilLista[0].codCarrera);             
        this.alumnoForm.controls['semestreNivel'].setValue(this.perfilLista[0].semestreNivel);
        this.alumnoForm.controls['codSexo'].setValue(this.perfilLista[0].codSexo);
        this.alumnoForm.controls['idProvincia'].setValue(this.perfilLista[0].idProvincia);
        this.getCantones();                       
        this.alumnoForm.controls['idCanton'].setValue(this.perfilLista[0].idCanton);                    
        this.alumnoForm.controls['direccion'].setValue(this.perfilLista[0].direccion);
        this.alumnoForm.controls['telefonoCelular'].setValue(this.perfilLista[0].telefonoCelular);
        this.alumnoForm.controls['telefonoCasa'].setValue(this.perfilLista[0].telefonoCasa); 
        this.alumnoForm.controls['capacidades'].setValue(this.perfilLista[0].codCapacidades); 
        this.alumnoForm.controls['curso'].setValue((this.perfilLista[0].codCurso).trim()); 
      }

      this.obtenerImagen( x );

    })

  }

  public personalVinculacionLista: any = [];
  actualizarPerfil() {

    if( this.tipo == 'personal' || this.tipo == 'ADMINISTRADOR' )
      {
        if( this.perfilForm.controls['nombrePersonal'].value == '' ||
            this.perfilForm.controls['nombrePersonal'].value == undefined ||
            this.perfilForm.controls['nombrePersonal'].value == null ) Toast.fire({ icon: 'warning', title: 'El nombre no puede estar vacío...' })

        else if( this.perfilForm.controls['cedula'].value == '' ||
            this.perfilForm.controls['cedula'].value == undefined ||
            this.perfilForm.controls['cedula'].value == null ) Toast.fire({ icon: 'warning', title: 'La cédula no puede estar vacía...' })

        else if( this.perfilForm.controls['email'].value == '' ||
            this.perfilForm.controls['email'].value == undefined ||
            this.perfilForm.controls['email'].value == null ) Toast.fire({ icon: 'warning', title: 'El correo institucional no puede estar vacío...' })

        else if( this.perfilForm.controls['tipoPers'].value == '' ||
            this.perfilForm.controls['tipoPers'].value == undefined ||
            this.perfilForm.controls['tipoPers'].value == null ) Toast.fire({ icon: 'warning', title: 'El tipo de personal no puede estar vacío...' })


        else {
        let x: any = sessionStorage.getItem('UserCod');
        this.personalVinculacionLista = {
          "codPersonal":          x,
          "personaNombre":        this.perfilForm.controls['nombrePersonal'].value,
          "fechaMod":             new Date().toISOString(),
          "edad":                 this.perfilForm.controls['edad'].value,
          "correoInstitucional":  this.perfilForm.controls['email'].value,
          "correoPersonal":       this.perfilForm.controls['emailPers'].value,
          "codFacultad":          this.perfilForm.controls['facultad'].value,
          "codCarrera":           this.perfilForm.controls['carrera'].value,
          "semestreNivel": "",
          "idCanton":             this.perfilForm.controls['canton'].value,
          "idParroquia": "",
          "direccion":            this.perfilForm.controls['direccion'].value,
          "telefonoCelular":      this.perfilForm.controls['celular'].value,
          "telefonoCasa":         this.perfilForm.controls['telCasa'].value,
          "codcia":               this.codCia,
          "codSexo":              this.perfilForm.controls['sexo'].value,
          "tipo":                 this.perfilForm.controls['tipoPers'].value,
          "cedula":               this.perfilForm.controls['cedula'].value
        }
      
        this.personal.actualizarPersonal( x, this.personalVinculacionLista ).subscribe({
          next: (x) => {
          Toast.fire({ icon: 'success', title: 'Perfil ha sido editado...' }); 
        }, error: () => {
          Toast.fire({ icon: 'error', title: 'No se ha podido editar este estado...' }); 
        }
      }
        
        )

    }
  } else {
    this.editarPerfilAlumno();
  }
  }

  limpiar() {
    this.perfilForm
        .controls['cedula'].setValue('');
    this.perfilForm
        .controls['nombrePersonal'].setValue('');
    this.perfilForm
        .controls['edad'].setValue(0);
    this.perfilForm
        .controls['email'].setValue('');
    this.perfilForm
        .controls['emailPers'].setValue('');
    this.perfilForm
        .controls['canton'].setValue('');
    this.perfilForm
        .controls['direccion'].setValue('');
    this.perfilForm
        .controls['celular'].setValue('');
    this.perfilForm
        .controls['telCasa'].setValue('');
    this.perfilForm
        .controls['sexo'].setValue('');
    this.perfilForm
        .controls['tipoPers'].setValue('');
    this.perfilForm
        .controls['facultad'].setValue('');
    this.perfilForm
        .controls['carrera'].setValue('')
  }

}
