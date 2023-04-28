import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GenerarActividadService } from '../../agregar-actividad/services/generar-actividad.service';

@Component({
  selector: 'app-informes-gestor',
  templateUrl: './informes-gestor.component.html',
  styleUrls: ['./informes-gestor.component.scss']
})
export class InformesGestorComponent implements OnInit {

  /** VARIABLES CERTIFICACIONES INICIO */
  _certificado_de_la_secretaria_icon:             string = 'close';
  _oficio_de_la_coordinacion_de_gestion_social:   string = 'close';
  _oficio_de_aceptacion_de_la_empresa:            string = 'close';
  _ficha_de_datos_generales_del_estudiante:       string = 'close';
  _ficha_de_actividades_diarias_realizadas:       string = 'close';
  _ficha_de_supervision_de_tutor_academico:       string = 'close';
  _ficha_de_evaluacion_estudiantil:               string = 'close';
  _ficha_de_evaluacion_y_rendimiento_del_pasante: string = 'close';
  _certificacion_y_valoracion_de_fin_de_practica: string = 'close';
  _memoria_tecnica_impresa_aprobada:              string = 'close';
  _informe_y_valoracion_del_tutor_academico:      string = 'close';
  _Informe_y_valoracion_del_gestor_academico:     string = 'done';
  /** VARIABLES CERTIFICACIONES FIN */


  public alumnoGrupoLista: any = [];
  public fecInicio:     any;
  public fecFin:        any;
  _numeroProceso:       string = '';
  _nombreProyecto:      string = '';
  _descripcionProyecto: string = '';
  _cedula: string = '';

  public _estudiante: string = '';
  public _facultad:   string = '';
  public _carrera:    string = '';
  public _supervisor: string = '';

  public codCia = environment.codCia; 

  constructor( private actividades:  GenerarActividadService ) { }

  ngOnInit(): void {
    this.obtenerEstudiante()
  }

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
          console.warn('ESTUDIANTE');
          console.warn(element)
          this._estudiante    = element.alumnoNombre;
          this._facultad      = element.nombreFacultad;
          this._carrera       = element.carreraNombre;
          this._supervisor    = element.personaNombre;
          this._numeroProceso = element.numeroProceso;
          this._nombreProyecto = element.nombreProyecto;
          this._cedula        = element.cedula;
          this.fecInicio = element.fecInicio;
          this.fecFin = element.fecFin;          
        })
      }
    })
  }

}
