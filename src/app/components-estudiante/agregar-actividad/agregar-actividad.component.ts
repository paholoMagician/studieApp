import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProyectosService } from 'src/app/components/dashboard/generar-proyectos/services/proyectos.service';
import { ProcesosService } from 'src/app/components/dashboard/procesos/procesos-services/procesos.service';
import { BeneficiariosService } from 'src/app/components/dashboard/registro-beneficiario/beneficiarios.service';
import { SharedServicesService } from 'src/app/components/shared/services-shared/shared-services.service';
import { TokenService } from 'src/app/components/shared/services-shared/token.service';
import { environment } from 'src/environments/environment.prod';
// import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import Swal from 'sweetalert2'
import { GenerarActividadService } from './services/generar-actividad.service';
import { MatPaginator } from '@angular/material/paginator';
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
  selector: 'app-agregar-actividad',
  templateUrl: './agregar-actividad.component.html',
  styleUrls: ['./agregar-actividad.component.scss']
})
export class AgregarActividadComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public dis_button_actividad: boolean = true;

  icon_button: string = 'add';
  _cancel: boolean    = false;
  textButton: string  = 'Crear';
  _descrip_image: string = '';
  public agregarActividadForm = new FormGroup({
    nombreActivity:       new FormControl( '', [ Validators.required ]),
    descriptionActivity:  new FormControl( '', [ Validators.required ]),
    fecCreacion:          new FormControl( new Date(), [ Validators.required ]),
    idProyecto:           new FormControl( '', [ Validators.required ]),
    idProcesos:           new FormControl( '', [ Validators.required ]),
    observaciones:        new FormControl( '', [ Validators.required ]),
    horaIni:              new FormControl( '', [ Validators.required ]),
    horaFin:              new FormControl( '', [ Validators.required ]),
    horas:                new FormControl( '', [ Validators.required ])
  });

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

  constructor(public  token:          TokenService,
              private actividades:  GenerarActividadService,
              public general: GeneralService,
              public  proceso:        ProcesosService,
              private beneficiarios:  BeneficiariosService,
              public proyecto:        ProyectosService,
              public DataMaster:      SharedServicesService) { }
  
              public columnHead: any = [ 'edit', 'Fecha Creación', 'nombreActivity', 'descripcionActivity', 'horas'];

  public codec: string = '';
  public xuser: any = ''
  ngOnInit(): void {
    this.getDataMaster('LA00');
    let xgrupo: any = sessionStorage.getItem('codGrupo');
    this.getCia();
    if( xgrupo == undefined || xgrupo == null || xgrupo == '' ) this.dis_button_actividad = true; 
    else this.dis_button_actividad = false;
    this.obtenerImagen();
    this.ObtenerAlumnosGrupoRegistros();
    this.xuser = sessionStorage.getItem('UserCod');
    console.warn(this.xuser)
    this.codec = 'REGACT-'+this.token.generateRandomString(15);
    this.obtenerRegistrosdeActividades();
  }

  public listaActividades: any = [];
  getDataMaster(cod:string) {
    this.DataMaster.getDataMaster(cod).subscribe({
      next: (Data) => {

        switch(cod) {
          case 'LA00':
            this.listaActividades = Data;
            //console.log(this.estadoCivilLista)
            break;
        }
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  validate() {
    if( this.agregarActividadForm.controls['horas'].value > 6 ) {
      this.agregarActividadForm.controls['horas'].setValue(6);
    }
  }

  catcthData(data: any) {
    console.log(data);
    this.agregarActividadForm.controls['nombreActivity'].setValue(data.nombreActivity);
    this.agregarActividadForm.controls['descriptionActivity'].setValue(data.descriptionActivity);
    this.agregarActividadForm.controls['horas'].setValue(data.horas);
  }

  public alumnoGrupoLista: any = [];
  public proyectoNombre: string = '';
  public idProyecto: string = '';
  public procesoNombre: string = '';
  public nombreGrupo: string = '';
  public idProceso: string = '';
  public idGrupo: string = '';
  public horas: number = 0;
  ObtenerAlumnosGrupoRegistros() {
    
    let x: any = sessionStorage.getItem('UserCod');

    this.actividades.ObtenerAlumnosGrupoRegistros( x, this.codCia ).subscribe({
      next: (alumnogrupo) => {
        this.alumnoGrupoLista = alumnogrupo;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.warn(this.alumnoGrupoLista);
        this.alumnoGrupoLista.filter( (element:any) => {
          
          console.warn('>>>>>>>>>>>>>>>>')
          console.warn(element)
          console.warn('>>>>>>>>>>>>>>>>')

          this.idGrupo = element.codGrupo;
          this.agregarActividadForm.controls['idProyecto'].setValue(element.nombreProyecto);
          this.proyectoNombre =  element.nombreProyecto;
          this.idProyecto =  element.idProyecto;
          this.agregarActividadForm.controls['idProcesos'].setValue(element.numeroProceso);
          this.idProceso   = element.idProcesos;
          this.nombreGrupo = element.nombreGrupo;
          this.idGrupo = element.codGrupo
          this.horas = element.horas;
          console.warn(this.horas);

          this.fechaFinalProceso  = element.fecFin;
          this.fechaInicioProceso = element.fecInicio;

        })
        // this.limpiar();
      }
    })
  }


  public fechaFinalProceso: any;
  public fechaInicioProceso: any;
  // obtenerFechaFinal() {
  //   this.listaProyectosObtenidas.filter((element:any) => {
  //     if(element.idProyecto == this.procesosForm.controls['idProyecto'].value) {
  //       this.fechaFinalProyecto = element.ffin;
  //       console.log(this.fechaFinalProyecto);
  //     }
  //   })
  // }

  validateDate() {
    let fechActual = new Date();
    let fin = this.fechaFinalProceso.toString().split('T')
    let inicio = this.fechaInicioProceso.toString().split('T')
    let x =(fechActual.getDay()).toString().padStart(2,'0') + '-' + fechActual.getMonth().toString().padStart(2,'0') + '-' + fechActual.getFullYear();
    console.log(x)
    // if( this.agregarActividadForm.controls['fecCreacion'].value > this.fechaFinalProceso ) {
    //   Swal.fire({
    //     icon:  'warning',
    //     title: 'Oops...',
    //     html:  '<div style="height: 150px; display: flex; flex-direction: column;"><span>La fecha límite de la actividad la delimita el proceso asignado:</span> ' + '<span style="color: white; background: red; padding: 5px; border-radius: 10px; "> Fecha <strong>final</strong> del proceso: <strong> '+ fin[0] + '</strong> </span></div>'
    //   })
    //   this.agregarActividadForm.controls['fecCreacion'].setValue(x);
    // }
    // else if( this.agregarActividadForm.controls['fecCreacion'].value < this.fechaInicioProceso ) {
    //   Swal.fire({
    //     icon:  'warning',
    //     title: 'Oops...',
    //     html:  '<div style="height: 150px; display: flex; flex-direction: column;"><span>La fecha inicial de la actividad la delimita el proceso asignado:</span> ' + '<span style="color: white; background: red; padding: 5px; border-radius: 10px; "> Fecha <strong> inicial </strong> del proceso: <strong> '+ inicio[0] + '</strong> </span></div>'
    //   })
    //   this.agregarActividadForm.controls['fecCreacion'].setValue(x);
    // }
  }


  public registrosActividadLista: any = [];
  public totalHorasLaboradas: number = 0;
  public procentajeTrabajado: number = 0;
  obtenerRegistrosdeActividades() {
    let x: any = sessionStorage.getItem('UserCod');
    this.totalHorasLaboradas = 0;
    this.procentajeTrabajado = 0;
    this.actividades.ObtenerRegistroActividades(x, this.codCia).subscribe({
      next: ( listregistros ) => {
        this.registrosActividadLista = listregistros;
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        console.log('Este es el registrosActividadLista')
        console.log(this.registrosActividadLista)

        this.registrosActividadLista.filter( (element:any) => {
          this.totalHorasLaboradas += element.horas;
          this.procentajeTrabajado = (this.totalHorasLaboradas / this.horas) * 100;
        })

        this.dataSource = new MatTableDataSource(this.registrosActividadLista);
        this.dataSource.paginator = this.paginator;

      }
    })
  }

  public titleImagen: boolean = true;
  public buttonCancelImagen: boolean = false;
  validacionImagen() {
    if( this._IMGE == '' || this._IMGE == null || this._IMGE == undefined ) this.titleImagen = true;
    else this.titleImagen = false , this.buttonCancelImagen = true;
  }

  limpiarImagen() {
    this._IMGE = '';
    this._descrip_image = '';
    this.titleImagen = true;
    this.buttonCancelImagen = false;
  }

  onSubmit() {
    this.guardarRegistroActividad();
  }

  catchFile() {

  }

  limpiar() {
    this.codec = '';
    this.agregarActividadForm.controls['nombreActivity'].setValue('');
    this.agregarActividadForm.controls['descriptionActivity'].setValue('');
    this.nombreGrupo = '';
    this.idProyecto = '';
    this.proyectoNombre = '';
    this.idProceso = '';
    this.procesoNombre = '';
    let date = new Date();
    let dia = date.getDay();
    let mes = date.getMonth();
    let anio = date.getFullYear();
    this._descrip_image = '';
    // this.agregarActividadForm
    // .controls['fecCreacion']
    // .setValue(dia.toString().padStart(2,'0')+'/'+mes.toString().padStart(2,'0')+'/'+anio.toString());

    this.agregarActividadForm.controls['idProcesos'].setValue('');
    this.agregarActividadForm.controls['idProyecto'].setValue('');
    this.agregarActividadForm.controls['observaciones'].setValue('');
    this.idGrupo = '';
    this.agregarActividadForm.controls['horas'].setValue('');
    this.imagenLista = [];
  }


  public _IMGE: any = '../../../assets/sin_imagen.png';
  imgeList: any = [];
  public count: number = 0;
  encodeImageFileAsURL() {
    this.count ++
    const filesSelected: any = document.getElementById('fileUp'.toString()) as HTMLInputElement;
    const fileId: any = filesSelected.files;
    let base;
    if (fileId.length > 0) {
      const fileToLoad: any = filesSelected[0];
      const fileReader: any = new FileReader();
      fileReader.onload = () => {
        base = fileReader.result;
      };
      fileReader.onloadend = () => {
          this._IMGE = fileReader.result;
      };
      fileReader.readAsDataURL(fileId[0]);
    }

  }

  
  public imagenLista: any = [];
  
  saveImagen(img: string) {
    
    // +dia.toString().padStart(2,'0')+'-'+mes.toString().padStart(2,'0')+'-'+anio.toString()
    
    this.imagenLista = {
      codEntidad: this.xuser,
      imagen: img,
      detalle: this._descrip_image,
      ccia: this.codCia,
      idGrupo: this.idGrupo,
      idProyecto: this.idProyecto,
      fecCrea: new Date(),
      codRegistroActividad: this.codec,
    }

    console.warn(this.imagenLista);
          
    this.DataMaster.guardarImagenActividad(this.imagenLista).subscribe(
      {
        next: ( imagen ) => {
          Toast.fire({ icon: 'success', title: 'Imagen de Actividad añadida...' }); 
        }, error: (e) => {
          console.error(e);
          Toast.fire({ icon: 'error', title: 'Error al cargar la imagen a la base de daatos...' });
          // this.editarImagen(x, this.imagenLista);
        }, complete: () => {
          this._IMGE = '../../../assets/sin_imagen.png';
          this.obtenerImagen();
        }
      }
    )    
  }

 obtenerImagen() {

  this.DataMaster.obtenerImagenActividad(this.codec).subscribe({
    next: (img) => {
      this.imagenLista = img;
    },
    error: (e) => {
      console.error(e);
    },
    complete: () => {
      console.warn(this.imagenLista);
    }
  })
  
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

  public actividad: any = [];
  guardarRegistroActividad() {
    this.actividad = {
      codRegActivity:      this.codec,
      nombreActivity:      this.agregarActividadForm.controls['nombreActivity'].value,
      descriptionActivity: this.agregarActividadForm.controls['descriptionActivity'].value,
      fecCreacion:         this.agregarActividadForm.controls['fecCreacion'].value,
      ccia:                this.codCia,
      idProyecto:          this.idProyecto,
      idProceso:           this.agregarActividadForm.controls['idProcesos'].value,
      hora_ini:            null,
      hora_fin:            null,
      observaciones:       this.agregarActividadForm.controls['observaciones'].value,
      idUser:              this.xuser,
      idGrupo:             this.idGrupo,
      horas:               this.agregarActividadForm.controls['horas'].value
    }

    console.log( 'actividad' )
    console.log( this.actividad )

    this.actividades.guardarActividad(this.actividad).subscribe({
      next: (x) => {
        Toast.fire({ icon: 'success', title: 'Actividad Guardada...' }); 
      },
      error: (e) => {
        console.error(e);
        Toast.fire({ icon: 'error', title: 'Error al guardar la actividad...' });
      },
      complete: () => {
        this.saveImagen(this._IMGE);
        this.obtenerRegistrosdeActividades();
        this.limpiar();
      }
    })
  }



} 
