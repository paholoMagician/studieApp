import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GenerarActividadService } from '../agregar-actividad/services/generar-actividad.service';
import * as moment from 'moment';
import { elementAt } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';

function convertirFecha(fecha: string): string {
  return moment(fecha, 'YYYY-MM-DD').format('DD-MM-YYYY');
}

@Component({
  selector: 'app-generar-reportes',
  templateUrl: './generar-reportes.component.html',
  styleUrls: ['./generar-reportes.component.scss']
})
export class GenerarReportesComponent implements OnInit {

  public _estudiante: string = '';
  public _facultad:   string = '';
  public _carrera:    string = '';
  public _supervisor: string = '';
  
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

  public registrosActividadLista: any = [];

  constructor(private actividades:  GenerarActividadService, public general: GeneralService,) { }

  ngOnInit(): void {
    this.getCia();
    this.obtenerEstudiante();
    this.obtenerRegistrosdeActividades();
  }

  public alumnoGrupoLista: any = [];
  public fecInicio: any;
  public fecFin: any;
  _numeroProceso: string = '';
  _nombreProyecto: string = '';
  _descripcionProyecto: string = '';
  obtenerEstudiante() {
    let x: any = sessionStorage.getItem('UserCod');
    this.actividades.ObtenerAlumnosGrupoRegistros( x, this.codCia ).subscribe({
      next: (alumnogrupo) => {
        this.alumnoGrupoLista = alumnogrupo;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.alumnoGrupoLista.filter( (element:any) => {
          console.warn(element)
          this._estudiante = element.alumnoNombre;
          this._facultad = element.nombreFacultad;
          this._carrera = element.carreraNombre;
          this._supervisor = element.personaNombre;
          this._numeroProceso = element.numeroProceso;
          this._nombreProyecto = element.nombreProyecto;
          // this._descripcionProyecto = element.descriptionActivity;
          // calculando las semanas
          // console.warn(element.descriptionActivity)
          // console.warn('calculando las semanas')
          this.fecInicio = element.fecInicio;
          this.fecFin = element.fecFin;          
        })
        // console.warn(this.fecInicio)
        // console.warn(this.fecFin)
        this.calcularSemanas(this.fecInicio, this.fecFin);
      }
    })
  }

  obtenerRegistrosdeActividades() {
    let x: any = sessionStorage.getItem('UserCod');
    this.actividades.ObtenerRegistroActividades(x, this.codCia).subscribe({
      next: ( listregistros ) => {
        this.registrosActividadLista = listregistros;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.log('Este es el registrosActividadLista');
        console.log(this.registrosActividadLista);
        this.validarActividadFecha();
      }
    })
  }

  semanas: any = 0;
  diasPorSemana: any[] = [];
  public dias: any = []
  calcularSemanas(fechaInicial: any, fechaFinal: any) {

    const fechaInicio = moment(fechaInicial);
    const fechaFin = moment(fechaFinal);
    this.semanas = fechaFin.diff(fechaInicio, 'weeks');

    let fechaActual = moment(fechaInicio);
    this.diasPorSemana = [];

    for (let i = 0; i < this.semanas; i++) {
      this.dias = [];
      for (let j = 0; j < 7; j++) {
        this.dias.push(
          {
            observaciones: 'NO APLICA, DEBIDO A QUE NO SE DESIGNÓ NINGUNA ACTIVIDAD',
            sumatoria: 0,
            semana: i + 1,
            fechaDia: fechaActual.format('DD-MM-YYYY'),
            nHoras: 0,
            descripcion: 'NO APLICA, DEBIDO A QUE NO SE DESIGNÓ NINGUNA ACTIVIDAD'
          }
        );
        fechaActual.add(1, 'days');
      }
      this.diasPorSemana.push(this.dias);
    }

    const diasRestantes = fechaFin.diff(fechaActual, 'days');
    if (diasRestantes > 0) {
      this.dias = [];
      for (let j = 0; j < diasRestantes; j++) {
        this.dias.push(
          {
            observaciones: 'NO APLICA, DEBIDO A QUE NO SE DESIGNÓ NINGUNA ACTIVIDAD',
            sumatoria: 0,
            semana: this.semanas,
            fechaDia: fechaActual.format('DD-MM-YYYY'),
            nHoras: 0,
            descripcion: 'NO APLICA, DEBIDO A QUE NO SE DESIGNÓ NINGUNA ACTIVIDAD'
          }
        );
        fechaActual.add(1, 'days');
      }
      this.diasPorSemana.push( this.dias );
      this.semanas++;
    }

  }

  public sumatoryHoras: any = []
  validarActividadFecha() {
    this.diasPorSemana.filter( semanas => {
      semanas.find((dias:any) => {
        let dia = moment(dias.fechaDia, 'DD-MM-YYYY').format('DD-MM-YYYY');        
        this.registrosActividadLista.filter( (diaActividad:any) => {
          let diaAct =  moment(diaActividad.fecCreacion, 'YYYY-MM-DD').format('DD-MM-YYYY');
          if( dia == diaAct ) {
            dias.nHoras = diaActividad.horas;
            dias.descripcion = diaActividad.descriptionActivity;
          }
        })
      })

    })
    

    this.sumarPorSemana(this.diasPorSemana);

  }

    sumarPorSemana(modelo: any[]) {
      const semanas: any = {};
      modelo.forEach( sem => {
        sem.filter( (registro:any) => {
          const semana = registro.semana;
          const nHoras = registro.nHoras;
          if (!semanas[semana]) {
            semanas[semana] = nHoras;
          } else {
            semanas[semana] += nHoras;
          }
        })
      });
      modelo.forEach(sem => {
        sem.filter( (registro:any) => {
          const semana = registro.semana;
          registro.sumatoria = semanas[semana];
        })
      });

      console.warn('MODELO MODIFICADO')
      console.warn('-------------------------')
      console.warn(modelo)
      console.warn('-------------------------')

    }



}
