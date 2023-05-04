import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedServicesService } from '../shared/services-shared/shared-services.service';
import { GeneralService } from 'src/app/services/general.service';
import { TokenService } from '../shared/services-shared/token.service';
import { InstitutosService } from '../dashboard/insitutos-maestro/services/institutos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-miempresa',
  templateUrl: './miempresa.component.html',
  styleUrls: ['./miempresa.component.scss']
})
export class MiempresaComponent implements OnInit {

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

  constructor( public DataMaster: SharedServicesService, 
               public general: GeneralService, 
               public token: TokenService,
               public institutos: InstitutosService ) { }


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


  ngOnInit(): void {
    this.getCia();
    this.getDataMaster('PRV00')
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

  limpiar() {}

  onSubmit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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


    public institutoModdel: any = [];
    guardarInstituto() {  
      this.institutoModdel = {
        "codcia": '',
        "ruc": '',
        "correo": '',
        "cta1": '',
        "cta2": '',
        "nombre": '',
        "descripcion": '',
        "telef_a": '',
        "telf_b": '',
        "telf_c": '',
        "email1": '',
        "email2": '',
        "direccion": '',
        "fecCrea": '',
        "web": '',
        "horasVinc": '',
        "codProvincia": '',
        "codCanton": ''
      }

    }

}
