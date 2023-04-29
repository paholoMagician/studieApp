import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import { InstitutosService } from './services/institutos.service';
import { TokenService } from '../../shared/services-shared/token.service';

import Swal from 'sweetalert2'
import { environment } from 'src/environments/environment.prod';
import { MatPaginator } from '@angular/material/paginator';

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
  selector: 'app-insitutos-maestro',
  templateUrl: './insitutos-maestro.component.html',
  styleUrls: ['./insitutos-maestro.component.scss']
})
export class InsitutosMaestroComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public dataSource!: MatTableDataSource<any>;
  columnHead: any = [ 'edit', 'alias', 'nombreInstituto', 'telefono', 'email', 'tipoIntituto', 'direccion', 'provincia', 'canton' ];
  textButton: string = 'Crear';
  icon_button: string = 'add';
  _cancel: boolean = false;

  public estadoCivilLista: any = [];
  public provinciaLista: any = [];
  public sexoLista: any = [];
  public tipoPersonaLista: any = [];
  public carrerasLista: any = [];
  public facultadLista: any = [];
  public tipoInstitucionLista: any = [];

  public codCia = environment.codCia; 

  public institutosForm = new FormGroup({
    nombreInstituto:              new FormControl( '', [ Validators.required ]),
    alias:                        new FormControl( '', [ Validators.required ]),
    idProvincia:                  new FormControl( '', [ Validators.required ]),
    idCanton:                     new FormControl( '', [ Validators.required ]),
    direccion:                    new FormControl( '', [ Validators.required ]),
    telefonoCelular:              new FormControl( '', [ Validators.required ]),
    tipoInsti:                    new FormControl( '', [ Validators.required ]),
    email:                        new FormControl( '', [ Validators.required ]),
    telefono:                     new FormControl( '', [ Validators.required ])
  });


  constructor( public DataMaster: SharedServicesService, public token: TokenService, public institutos: InstitutosService ) { }

  ngOnInit(): void {
    this.getDataMaster('PRV00');
    this.getDataMaster('TIN');
    this.obtenerIntitutos();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit() {
    switch (this.textButton) {
      case 'Crear':
        this.guardarInstituto()
        break;
      case 'Editar':
        this.editarIntituciones()
        break;
    }
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
          case 'TIN':
            this.tipoInstitucionLista = Data;
            break;
        }
      }
    })
  }


  public cantonLista:    any = [];
  getCantones() {
    this.DataMaster.getDataMaster(Number( this.institutosForm.controls['idProvincia'].value)  ).subscribe({
      next: (cantones) => {
        this.cantonLista = cantones;
      }, 
      error: (e) => {
        console.error(e);
      }
    })
  }

  public listadeInstitutosObtenidos: any = []
  obtenerIntitutos() {
    this.institutos.obtenerInstitutos(this.codCia).subscribe({
      next: (institutos) => {
        this.listadeInstitutosObtenidos = institutos;
        console.log(this.listadeInstitutosObtenidos)
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        this.dataSource = new MatTableDataSource(this.listadeInstitutosObtenidos);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  public institutosListas: any = [];
  guardarInstituto() {
    let fecha = new Date();    
    const codecInstitutos: string = 'INT-' + this.token.generateRandomString(10) + '-F-' +  fecha.getDay().toString().padStart(2, '0')+'-'+fecha.getMonth().toString().padStart(2, '0')+'-'+fecha.getFullYear();

    this.institutosListas = {   
        "codInstiProy":    codecInstitutos,
        "nombreInstituto": this.institutosForm.controls['nombreInstituto'].value,
        "alias":           this.institutosForm.controls['alias']          .value,
        "idProvincia":     this.institutosForm.controls['idProvincia']    .value,
        "idCanton":         this.institutosForm.controls['idCanton']       .value,
        "direccion":       this.institutosForm.controls['direccion']      .value,
        "telefonoCelular": this.institutosForm.controls['telefonoCelular'].value,
        "email":           this.institutosForm.controls['email']          .value,
        "tipoInsti":       this.institutosForm.controls['tipoInsti']      .value,
        "telefono":        this.institutosForm.controls['telefono']       .value,
        "codcia":          this.codCia
      }

      console.log('INSTITUCIONES GUARDADAS')
      console.log(this.institutosListas)

      this.institutos.guardarInstituciones(this.institutosListas).subscribe({
        next: (x) => {
          console.log(x);
          Toast.fire({ icon: 'success', title: 'Instituciones creadas...' });
        }, error: (e) => {
          console.error(e);
          Toast.fire({ icon: 'error', title: 'Institución no ha sido creada...' });
        }, complete: () => {
          this.obtenerIntitutos();
          this.limpiar();
        }
      })

    }

    public consinsti: string = '';
    catchData(data: any) {
      this.institutosForm.controls['nombreInstituto'].setValue(data.nombreInstituto);
      this.institutosForm.controls['alias']          .setValue(data.alias);
      this.institutosForm.controls['idProvincia']    .setValue(data.idProvincia);
      this.getCantones();
      this.institutosForm.controls['idCanton']       .setValue(data.idCanton);
      this.institutosForm.controls['direccion']      .setValue(data.direccion);
      this.institutosForm.controls['telefonoCelular'].setValue(data.telefonoCelular);
      this.institutosForm.controls['email']          .setValue(data.email);
      this.institutosForm.controls['tipoInsti']      .setValue(data.tipoInsti);
      this.institutosForm.controls['telefono']       .setValue(data.telefono);
      this.textButton = 'Editar';
      this.icon_button = 'sync_alt';
      this.consinsti = data.codInstiProy;
      this._cancel = true;
    }

    editarIntituciones() {
      this.institutosListas = {   
        "codInstiProy":    this.consinsti,
        "nombreInstituto": this.institutosForm.controls['nombreInstituto'].value,
        "alias":           this.institutosForm.controls['alias']          .value,
        "idProvincia":     this.institutosForm.controls['idProvincia']    .value,
        "idCanton":        this.institutosForm.controls['idCanton']       .value,
        "direccion":       this.institutosForm.controls['direccion']      .value,
        "telefonoCelular": this.institutosForm.controls['telefonoCelular'].value,
        "email":           this.institutosForm.controls['email']          .value,
        "tipoInsti":       this.institutosForm.controls['tipoInsti']      .value,
        "telefono":        this.institutosForm.controls['telefono']       .value,
        "codcia":          this.codCia
      }
      
      this.institutos.editarInstitutos(this.consinsti, this.institutosListas).subscribe(
        {
          next: (x) => {
            console.log(x);
            Toast.fire({ icon: 'success', title: 'Instituciones creadas...' });
          }, error: (e) => {
            console.error(e);
            Toast.fire({ icon: 'error', title: 'Institución no ha sido creada...' });
          }, complete: () => {
            this.obtenerIntitutos();
            this.limpiar();
          }
        }
      )
    }

    limpiar() {
      this.institutosForm.controls['nombreInstituto'] .setValue('');
      this.institutosForm.controls['alias']           .setValue('');
      this.institutosForm.controls['idProvincia']     .setValue('');
      this.institutosForm.controls['idCanton']        .setValue('');
      this.institutosForm.controls['direccion']       .setValue('');
      this.institutosForm.controls['telefonoCelular'] .setValue('');
      this.institutosForm.controls['email']           .setValue('');
      this.institutosForm.controls['tipoInsti']       .setValue('');
      this.institutosForm.controls['telefono']        .setValue('');
      this.textButton = 'Crear';
      this.icon_button = 'add';
      this._cancel = false;
    }

    eliminarInstitutos(codInstiProy: string ) {

      Swal.fire({
        title: 'Estas seguro?',
        text: "Las instituciones son utilizadas en otros procesos",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'cancelar'
      }).then((result) => {
        if (result.isConfirmed) {

          console.log('codigo de la institucion eliminada');
          console.log(codInstiProy);

          this.institutos.eliminarInstitutos(codInstiProy).subscribe({
            next: () => {
              Swal.fire(
                'Eliminado!',
                'Institución ha sido eliminada',
                'success'
              )
            },
            error: (e) => {
              console.error(e);
              Swal.fire(
                'Opps!',
                'La institución no se ha podido eliminar.',
                'error'
              )
            },
            complete: () => {
              this.obtenerIntitutos();
            }
          })
        }
      })
      
    }

}
