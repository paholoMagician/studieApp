import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProcesosComponent } from '../procesos.component';
import { MatTableDataSource } from '@angular/material/table';
import { EstudiantesService } from '../../estudiantes/services/estudiantes.service';
import { environment } from 'src/environments/environment.prod';
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
  selector: 'app-modal-procesos',
  templateUrl: './modal-procesos.component.html',
  styleUrls: ['./modal-procesos.component.scss']
})
export class ModalProcesosComponent implements OnInit {
  public codCia = environment.codCia;
  columnHeadGrupo: any = [ 'seleccionar', 'Nombres', 'cantidadEstudiantes' ];
  // public dataSourceAdd!: MatTableDataSource<any>;
  public dataSource!: MatTableDataSource<any>;

  constructor( private estudiantes: EstudiantesService, public dialogRef: MatDialogRef<ProcesosComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.obtenerEstudiantes()
  }

  obtenerGrupo(codGrupo: string, nombreGrupo: string) {
    this.data.codGrupo = codGrupo;
    this.data.nombreGrupo = nombreGrupo;
    this.onNoClick();
  }

  applyFilterAdd(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public grupoEstudiantesLista: any = []
  obtenerEstudiantes() {
    this.estudiantes.obtenerGrupoEstudiantes(this.codCia).subscribe({
      next: (grupo) => {
        this.grupoEstudiantesLista = grupo;
        console.warn('GRUPOS');
        console.warn(this.grupoEstudiantesLista);
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource(this.grupoEstudiantesLista);
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}
