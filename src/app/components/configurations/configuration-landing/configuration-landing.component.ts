import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedServicesService } from '../../shared/services-shared/shared-services.service';
import Swal from 'sweetalert2'
import { ConfigurationServicesService } from '../services/configuration-services.service';
import { EmpresaService } from '../../miempresa/services/empresa.service';

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
  selector: 'app-configuration-landing',
  templateUrl: './configuration-landing.component.html',
  styleUrls: ['./configuration-landing.component.scss']
})
export class ConfigurationLandingComponent implements OnInit {
  public textButton = 'Crear';
  constructor(public institutos: EmpresaService, public DataMaster: SharedServicesService, public conf: ConfigurationServicesService) { }

  ngOnInit(): void {
    this.obtenerImagen();
    this.obtenerEmpresa();
  }

  onSubmit() {
    switch( this.textButton ) {
      case 'Crear':
        this.guardarLandingConf();
        break;
      case 'Actualizar':
        // 
        break;
    }
  }

  public landingForm = new FormGroup({
    tituloTema:              new FormControl( '' ),
    formularioFondo:         new FormControl( '' ),
    formularioColorLetras:   new FormControl( '' ),
    botonIngresoFondo:       new FormControl( '' ),
    botonIngresoColorLetras: new FormControl( '' ),
    bordeLateralColor:       new FormControl( '' ),
    tituloLanding:           new FormControl( '' ),
    logotipo:                new FormControl( '' ),
    backgroundLanding:       new FormControl( '' ),
    estadoMatriculaRegistro: new FormControl( false )    
  });

    public landConf: any = [];
    guardarLandingConf() {
      
      this.landConf = {
        "tituloTema":              this.landingForm.controls['tituloTema'].value,
        "backgroundLanding":       this.landingForm.controls['backgroundLanding'].value,
        "logotipo":                null,
        "formularioFondo":         this.landingForm.controls['formularioFondo'].value,
        "formularioColorLetras":   this.landingForm.controls['formularioColorLetras'].value,
        "botonIngresoFondo":       this.landingForm.controls['botonIngresoFondo'].value,
        "botonIngresoColorLetras": this.landingForm.controls['botonIngresoColorLetras'].value,
        "bordeLateralColor":       this.landingForm.controls['bordeLateralColor'].value,
        "estadoMatriculaRegistro": this.landingForm.controls['estadoMatriculaRegistro'].value,
        "codInstituto":            this.codc,
        "tituloLanding":           this.landingForm.controls['tituloLanding'].value,
        "backgroundImgLanding":    null
      }
    
      this.conf.guardarLandingConf( this.landConf ).subscribe({
        next: (x) => {
          Toast.fire({ icon: 'success', title: 'Se ha guardado la configuración...' }); 
        },
        error: (e) => {
          Toast.fire({ icon: 'error', title: 'No hemos podido editar...' }); 
        },
        complete: () => {
        
        }
      })
    
    }

    public listaInstituto: any = [];
    public codc: string = '';
    obtenerEmpresa() {
      this.institutos.obtenerEmpresa().subscribe({
        next: (empresa) => {
          this.listaInstituto = empresa;
          this.codc = this.listaInstituto.codcia;
          console.warn(this.codc);
        }, error: (e) => {
          console.error(e);
        }
      });
    }

public _IMGE: string = '';
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
      // this.saveImagen(this._IMGE);
    };

    fileReader.readAsDataURL(fileId[0]);

  }

}

listaImagen: any = [];
obtenerImagen() {
  let x: any = sessionStorage.getItem('UserCod');
  // console.log(x)
  this.DataMaster.obtenerImagen('Logo-'+x, 'LOGOTIPO').subscribe({
    next:(img) => {
      console.log(img);
      this.listaImagen = img;
      console.log('===============================')
      console.log(this.listaImagen)
      console.log('===============================')
      this._IMGE = this.listaImagen[0].imagenContent;
    }
  })
}

imagenLista: any = [];
saveImagen(img: string) {
    
    let x: any = sessionStorage.getItem('UserCod');

    this.imagenLista = {
      idImagen     : 'Logo-'+x,
      tipo         : 'LOGOTIPO',
      ImagenContent: img
    }

    console.warn(this.imagenLista);
        
    this.DataMaster.guardarImagen(this.imagenLista)
                   .subscribe({
      next: ( imagen ) => {
        console.log(imagen);
        console.log('imagen guardada');
        Toast.fire({ icon: 'success', title: 'Perfil ha sido editado...' }); 
      }, error: (e) => {
        console.error(e);
        this.editarImagen('Logo-'+x, this.imagenLista);
      }
    }
    )
  }

  editarImagen(codUser:string, model: any []) {
    this.DataMaster.editarImagen( codUser, model ).subscribe({
      next: ( imagen ) => {
        console.log(imagen);
        console.log('editado');
        Toast.fire({ icon: 'success', title: 'Ya lo hemos editado...' }); 
      }, error: (e) => {
        console.error(e);
        Toast.fire({ icon: 'success', title: 'No lo hemos podido editar...' }); 
      }
    })
  }

}
