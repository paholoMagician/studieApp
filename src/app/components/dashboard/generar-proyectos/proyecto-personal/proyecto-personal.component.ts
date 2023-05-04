import { Component, OnInit, Inject } from '@angular/core';
import { SharedServicesService } from 'src/app/components/shared/services-shared/shared-services.service';
import { CrearConveniosComponent } from '../../crear-convenios/crear-convenios.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectosService } from '../services/proyectos.service';
import { environment } from 'src/environments/environment.prod';
import { MatTableDataSource } from '@angular/material/table';
import { ProcesosService } from '../../procesos/procesos-services/procesos.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-proyecto-personal',
  templateUrl: './proyecto-personal.component.html',
  styleUrls: ['./proyecto-personal.component.scss']
})
export class ProyectoPersonalComponent implements OnInit {

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
  
  public dataSource!: MatTableDataSource<any>;
  public personalVinculacion: any = [];
  public columnHead: any = [ 'action', 'nombrePersonal', 'Nombre Tipo', 'cedula' ];

  constructor( private procesos: ProcesosService,
               private proyecto: ProyectosService,
               private DataMaster: SharedServicesService,
               public general: GeneralService,
               private dialogRef: MatDialogRef<CrearConveniosComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any
            ) { }

  ngOnInit(): void {
    this.getCia();
    this.obtenerPersonal();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerPersonal() {
    this.proyecto.obtenerPersonalViculacio(this.codCia).subscribe({
      next: (personal) => {
        this.personalVinculacion = personal;
        console.log(this.personalVinculacion);
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource(this.personalVinculacion);
      }
    })
  }



  catchDataPersonal( nombrePersonal: string, codecPersonal: string ) {
    this.data.personal       = nombrePersonal;
    this.data.codigoPersonal = codecPersonal;
    this.onNoClick()
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}
