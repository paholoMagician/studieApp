import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgruparEstudiantesComponent } from '../agrupar-estudiantes.component';
import { MatTableDataSource } from '@angular/material/table';
import { RegistroAlumnoService } from '../../registrovinculacion/registrovinculacionServices/registro-alumno.service';
import { EstudiantesService } from '../../dashboard/estudiantes/services/estudiantes.service';
import { environment } from 'src/environments/environment.prod';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2'
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
  selector: 'app-modal-estudiantes-agrupar',
  templateUrl: './modal-estudiantes-agrupar.component.html',
  styleUrls: ['./modal-estudiantes-agrupar.component.scss']
})
export class ModalEstudiantesAgruparComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatPaginator)
  paginatorAdd!: MatPaginator;

  _icon: string = 'user';
  _title: string = 'Agrupar estudiantes para el grupo ';
  columnHead: any = [ 'Nombres', 'Capacidades', 'Curso', 'seleccionar' ];
  columnHeadGrupo: any = [ 'seleccionar', 'Nombres', 'Capacidades', 'Curso' ]
  public alumnosLista: any = '';
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
  constructor( public registrarAlumno: RegistroAlumnoService, public general: GeneralService,
               private alumnos: EstudiantesService,
               public dialogRef: MatDialogRef<AgruparEstudiantesComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) { }

  public dataSource!: MatTableDataSource<any>;
  public dataSourceAdd!: MatTableDataSource<any>;
  ngOnInit(): void {
    this.getUsers(); 
    this.obtenerCursos();
    this.obtenerGrupoTipo('hijos', this.data.codecGrupo);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterAdd(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAdd.filter = filterValue.trim().toLowerCase();
  }


  getUsers() {
    this.alumnos.obtenerAlunmnosSinGrupo(this.codCia)
                .subscribe( alumnos => {
                this.alumnosLista = alumnos;
                console.log('Alumnos sin grupo');
                console.log(this.alumnosLista);
                this.dataSource = new MatTableDataSource(this.alumnosLista);
                this.dataSource.paginator = this.paginator;
    }) 
  }

  eliminarAlumnosConGrupo(codEstuiante:string, codCurso: string, alumnoNombre: string) {

    this.alumnos.eliminarEstudainteGrupo( codEstuiante ).subscribe({
      next: () => {
        Toast.fire({
          icon: 'success',
          title: 'Estudiante eliminado del grupo'
        })
      },
      error: (e) => {
        console.error(e);
        Toast.fire({
          icon: 'error',
          title: 'No hemos podido eliminar el estudiante del grupo'
        })
      },
      complete: () => {

        const dataEstudiante = {
          codCurso: codCurso,
          alumnoNombre: alumnoNombre
        }

        this.alumnosLista.push(dataEstudiante);
        this.dataSource = new MatTableDataSource(this.alumnosLista);
        this.dataSource.paginator = this.paginator;

        this.obtenerGrupoTipo('hijos', this.data.codecGrupo);

        // for( let i=0; i <= this.lustaAlumnosConGrupo.legth; i++ ) {
        //   if( this.lustaAlumnosConGrupo[i].idEstudiante == codEstuiante ) {
        //     this.lustaAlumnosConGrupo.splice(i,1);
        //   }
        // }

        // this.getUsers();
      }
    })
  }

  public lustaAlumnosConGrupo: any = [];
  obtenerGrupoTipo(tpo: string, codGrupo: string) {
    this.alumnos.obtenerGrupoTipo(tpo, codGrupo, this.codCia).subscribe({
      next: (grupos) => {
        this.lustaAlumnosConGrupo = grupos;
        console.warn(this.lustaAlumnosConGrupo)
      },      
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSourceAdd = new MatTableDataSource(this.lustaAlumnosConGrupo);
      }
    })
  }

  public cursosLista: any = [];
  obtenerCursos() {
    this.alumnos.obtenerCursosEstudiantes(this.codCia).subscribe( {
      next: (cursos) => {
        this.cursosLista = cursos;
        console.log('Cursos');
        console.log(cursos);
      }
    })
  }

  listaGrupoAdd: any = [];
  guardarGrupos(idEstudiante: string) {

    this.listaGrupoAdd = {
      codGrupo: this.data.codecGrupo,
      nombreGrupo: this.data.nombreGrupo,
      idEstudiante: idEstudiante,
      codCia: this.codCia,
      fecCrea: new Date()
    } 

    console.log(this.listaGrupoAdd)

    this.alumnos.guardarGrupo(this.listaGrupoAdd).subscribe({
      next: (x) => {
        Toast.fire({
          icon: 'success',
          title: 'Estudiante añadido al grupo ' +this.data.nombreGrupo+ ' exitosamente'
        })
      }, error: (e) => {
        Toast.fire({
          icon: 'error',
          title: 'Algo ha ocurrido con el grupo'
        })
        console.error(e)
      },
      complete: () => {
        // this.lustaAlumnosConGrupo.unshift(this.listaGrupoAdd);
        // this.dataSourceAdd = new MatTableDataSource(this.lustaAlumnosConGrupo);
        // this.dataSourceAdd.paginator = this.paginatorAdd; 
        this.obtenerGrupoTipo('hijos', this.data.codecGrupo);
        this.getUsers();
      }
    })

  }



  

}
