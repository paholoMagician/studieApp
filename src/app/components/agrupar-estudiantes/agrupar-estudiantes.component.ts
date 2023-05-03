import { Component, OnInit } from '@angular/core';
import { TokenService } from '../shared/services-shared/token.service';
import { RegistroAlumnoService } from '../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { SharedServicesService } from '../shared/services-shared/shared-services.service';
import { EstudiantesService } from '../dashboard/estudiantes/services/estudiantes.service';
import { environment } from 'src/environments/environment.prod';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { MatDialog } from '@angular/material/dialog';
import { ModalEstudiantesAgruparComponent } from './modal-estudiantes-agrupar/modal-estudiantes-agrupar.component';
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
  selector: 'app-agrupar-estudiantes',
  templateUrl: './agrupar-estudiantes.component.html',
  styleUrls: ['./agrupar-estudiantes.component.scss']
})
export class AgruparEstudiantesComponent implements OnInit {

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

  columnHead: any = [ 'edit', 'Nombre del Grupo', 'FecCreacion', 'Alumnos' ]; 

  constructor(  public token: TokenService, public general: GeneralService,
                public registrarAlumno: RegistroAlumnoService,
                public shared: SharedServicesService,
                private alumnos: EstudiantesService,
                public dialog: MatDialog  ) { }

  panelOpenState = false;
  public dataSourceGrupos!: MatTableDataSource<any>;
  public grupoForm = new FormGroup ({
    nombreGrupo: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
      // llamar a los padres de los grupos
      // this.getCia();
      this.obtenerGrupoTipo('padre', 'void')
  }


  onSubmitGrupo() {
    switch (this.buttonTitle) {
      case 'Crear':
        this.guardarGrupos();
        break;
      case 'Editar':
        this.actualizarGrupo();
        break;
    }
  }

  listaGrupoAdd: any = [];
  guardarGrupos() {

    if( this.grupoForm.controls['nombreGrupo'].value == '' || this.grupoForm.controls['nombreGrupo'].value == undefined || this.grupoForm.controls['nombreGrupo'].value == null ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campos por llenar'
      })

    }
    else {
      
    let anio = new Date();
    const codec: any = 'GRU-'+this.token.generateRandomString(5)+ '-' + anio.getFullYear();

    this.listaGrupoAdd = {
      codGrupo: codec,
      nombreGrupo: this.grupoForm.controls['nombreGrupo'].value,
      idEstudiante: '',
      codCia: this.codCia,
      fecCrea: new Date()
    } 

    this.alumnos.guardarGrupo(this.listaGrupoAdd).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Grupo generado exitosamente'
        })
      }, error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Algo ha ocurrido con el grupo'
        })
        console.error(e)
      },
      complete: () => {
        this.limpiar()
        this.listaGruposPadres.unshift(this.listaGrupoAdd)
        this.dataSourceGrupos = new MatTableDataSource(this.listaGruposPadres);
      }
    }) 
  }
  }

  public _cancel: boolean = false;
  limpiar() {
    this._cancel = false;
    this._icon = 'add';
    this.buttonTitle = 'Crear';
    this.grupoForm.controls['nombreGrupo'].setValue('');
  }
  
  listaGruposPadres: any = [];
  listaGrupoHijos: any = [];
  obtenerGrupoTipo(tpo: string, codGrupo: string) {
    this.alumnos.obtenerGrupoTipo(tpo, codGrupo, this.codCia).subscribe({
      next: (grupos) => {
        switch( tpo ){
          case 'padre':
            this.listaGruposPadres = grupos;
            console.warn('PADRES')
            console.warn(this.listaGruposPadres)
          break;
          case 'hijos':
            this.listaGrupoHijos = grupos;
            console.warn('hijos')
            console.warn(this.listaGrupoHijos)
            break;
        }
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSourceGrupos = new MatTableDataSource(this.listaGruposPadres);
      }
    })
  }

  eliminarGrupoCompleto(codGruppo: string) {
    this.alumnos.eliminarGrupo(codGruppo).subscribe({
      next: (x) => {
        this.obtenerGrupoTipo('padre', 'void');
        Toast.fire({
          icon: 'success',
          title: 'Grupo eliminado exitosamente'
        })
      },
      error: (e) => {
        console.error(e)
        Toast.fire({
          icon: 'error',
          title: 'Grupo no se ha podido eliminar'
        })
      }
    })
  }

  public idGrupo:string = '';
  public _icon:string = 'add';
  public id: string = '';
  public buttonTitle: string = 'Crear';
  catchDataGrupo(data: any) {

    console.warn(data)
    this._cancel = true;
    this.idGrupo = data.codGrupo;
    this.id = data.id;
    this._icon = 'sync_alt';
    this.buttonTitle = 'Editar';
    this.grupoForm.controls['nombreGrupo'].setValue(data.nombreGrupo);

  }

  actualizarGrupo() {

    if( this.grupoForm.controls['nombreGrupo'].value == '' || this.grupoForm.controls['nombreGrupo'].value == undefined || this.grupoForm.controls['nombreGrupo'].value == null ) {
      Toast.fire({
        icon: 'warning',
        title: 'Campos por llenar'
      })

    }
    else {


    let listaGrupo: any = {
      "codGrupo":     this.idGrupo,
      "nombreGrupo":  this.grupoForm.controls['nombreGrupo'].value,
      "idEstudiante": "",
      "codcia":       this.codCia,
      "fecCrea":      new Date(),
      "id":           this.id
    }

    console.log('LISTA A EDITAR');
    console.log(listaGrupo);

    this.alumnos.actualizarGrupoEstudiantes(this.id, listaGrupo).subscribe({
      next: (x) => {
        this.obtenerGrupoTipo('padre', 'void');
        this.limpiar();
        Toast.fire({
          icon: 'success',
          title: 'Grupo editado exitosamente'
        })
      }, error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Grupo no se ha podido editar'
        })
      }
    }) 
    
    }

  }


  openDialog(codecGrupo: string, nombreGrupo: string): void {
    const dialogRef = this.dialog.open( ModalEstudiantesAgruparComponent, {
      height: '600px',
      width: '80%',
      data: {
        codecGrupo: codecGrupo,
        nombreGrupo: nombreGrupo
      },
    });


    dialogRef.afterClosed().subscribe( result => {      
      
      console.warn( result );

      // this.obtenerConvenioMacro();

    });
  }


}
