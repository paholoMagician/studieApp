import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { GenerarActividadService } from '../../agregar-actividad/services/generar-actividad.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// import jspdf from 'jspdf';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-evaluacion-practicante',
  templateUrl: './evaluacion-practicante.component.html',
  styleUrls: ['./evaluacion-practicante.component.scss']
})
export class EvaluacionPracticanteComponent implements OnInit {

  @ViewChild('content', { static: false })
  content!: ElementRef;
  /** VARIABLES CALIFICACION INICIO */
  
  conprac_1: string = '';
  conprac_2: string = '';
  conprac_3: string = '';
  conprac_4: string = '';
  conprac_5: string = '';

  conprac_1_obs: string = '';
  conprac_2_obs: string = '';
  conprac_3_obs: string = '';
  conprac_4_obs: string = '';
  conprac_5_obs: string = '';

  demin_1: string = '';
  demin_2: string = '';
  demin_3: string = '';
  demin_4: string = '';
  demin_5: string = '';

  posini_1: string = '';
  posini_2: string = '';
  posini_3: string = '';
  posini_4: string = '';
  posini_5: string = '';
  
  posini_1_obs: string = '';
  posini_2_obs: string = '';
  posini_3_obs: string = '';
  posini_4_obs: string = '';
  posini_5_obs: string = '';

  decap_1: string = '';
  decap_2: string = '';
  decap_3: string = '';
  decap_4: string = '';
  decap_5: string = '';

  habpar_1: string = '';
  habpar_2: string = '';
  habpar_3: string = '';
  habpar_4: string = '';
  habpar_5: string = '';

  demcomp_1: string = '';
  demcomp_2: string = '';
  demcomp_3: string = '';
  demcomp_4: string = '';
  demcomp_5: string = '';

  demcomp_1_obs: string = '';
  demcomp_2_obs: string = '';
  demcomp_3_obs: string = '';
  demcomp_4_obs: string = '';
  demcomp_5_obs: string = '';

  econst_1: string = '';
  econst_2: string = '';
  econst_3: string = '';
  econst_4: string = '';
  econst_5: string = '';
  
  cumpex_1: string = '';
  cumpex_2: string = '';
  cumpex_3: string = '';
  cumpex_4: string = '';
  cumpex_5: string = '';
  
  acvont_1: string = '';
  acvont_2: string = '';
  acvont_3: string = '';
  acvont_4: string = '';
  acvont_5: string = '';
  
  actituproa_1: string = '';
  actituproa_2: string = '';
  actituproa_3: string = '';
  actituproa_4: string = '';
  actituproa_5: string = '';
  
  copperm_1: string = '';
  copperm_2: string = '';
  copperm_3: string = '';
  copperm_4: string = '';
  copperm_5: string = '';
  
  respe_1: string = '';
  respe_2: string = '';
  respe_3: string = '';
  respe_4: string = '';
  respe_5: string = '';
  
  demuha_1: string = '';
  demuha_2: string = '';
  demuha_3: string = '';
  demuha_4: string = '';
  demuha_5: string = '';
  
  demupres_1: string = '';
  demupres_2: string = '';
  demupres_3: string = '';
  demupres_4: string = '';
  demupres_5: string = '';
  
  demuefic_1: string = '';
  demuefic_2: string = '';
  demuefic_3: string = '';
  demuefic_4: string = '';
  demuefic_5: string = '';

  demuefic_1_obs: string = '';
  demuefic_2_obs: string = '';
  demuefic_3_obs: string = '';
  demuefic_4_obs: string = '';
  demuefic_5_obs: string = '';
  
  creapro_1: string = '';
  creapro_2: string = '';
  creapro_3: string = '';
  creapro_4: string = '';
  creapro_5: string = '';
  
  persevenf_1: string = '';
  persevenf_2: string = '';
  persevenf_3: string = '';
  persevenf_4: string = '';
  persevenf_5: string = '';
  
  putrab_1: string = '';
  putrab_2: string = '';
  putrab_3: string = '';
  putrab_4: string = '';
  putrab_5: string = '';

  obs_generales: string = '';

  /** VARIABLES CALIFICACION FIN */


  public alumnoGrupoLista: any = [];
  public fecInicio:        any;
  public fecFin:           any;
  _numeroProceso:          string = '';
  _nombreProyecto:         string = '';
  _descripcionProyecto:    string = '';
  _cedula:                 string = '';

  public _estudiante: string = '';
  public _facultad:   string = '';
  public _carrera:    string = '';
  public _supervisor: string = '';

  public provinicaInstituto: string = '';
  public _nombreInstituto: string = '';

  conocimientos_practicante: number = 1;
  interes_aprender:          number = 1;
  posee_iniciativa:          number = 1;
  demuestra_capacidad:       number = 1;
  es_habil:                  number = 1;
  demuestra_comprom: number = 1;
  es_constante_y: number = 1;
  cumple_exactitud: number = 1;
  actua_voluntariamente_en: number = 1;
  actitud_posi: number = 1;
  coopera_manera_perm: number = 1;
  es_resp: number = 1;
  demuestra_habilidades: number = 1;
  demuestra_cuidadoso: number = 1;
  demuestra_eficaz_en: number = 1;
  es_creativo_propone: number = 1;
  es_perseverante: number = 1;
  es_puntual: number = 1;

  public validacionForm = new FormGroup({
    con_parti:                  new FormControl( 1, [ Validators.required ]),
    interes_aprender_en:        new FormControl( 1, [ Validators.required ]),
    posee_iniciativa_con:       new FormControl( 1, [ Validators.required ]),
    demuestra_capacidad_en:     new FormControl( 1, [ Validators.required ]),
    es_habil_para:              new FormControl( 1, [ Validators.required ]),
    demuestra_compromiso:       new FormControl( 1, [ Validators.required ]),
    es_constante:               new FormControl( 1, [ Validators.required ]),
    cumple_exactitud_esm:       new FormControl( 1, [ Validators.required ]),
    actua_voluntariamente:      new FormControl( 1, [ Validators.required ]),
    actitud_positiva:           new FormControl( 1, [ Validators.required ]),
    coopera_manera:             new FormControl( 1, [ Validators.required ]),
    es_respetuoso:              new FormControl( 1, [ Validators.required ]),
    demuestra_habilidades_lid:  new FormControl( 1, [ Validators.required ]),
    demuestra_cuidadoso_en:     new FormControl( 1, [ Validators.required ]),
    demuestra_eficaz:           new FormControl( 1, [ Validators.required ]),
    es_creativo_prop:           new FormControl( 1, [ Validators.required ]),
    es_perseverante_cu:         new FormControl( 1, [ Validators.required ]),
    es_puntual_en:              new FormControl( 1, [ Validators.required ]),
    con_partiobs1:              new FormControl( '', [ Validators.required ]),
    con_partiobs2:              new FormControl( '', [ Validators.required ]),
    con_partiobs3:              new FormControl( '', [ Validators.required ]),
    con_partiobs4:              new FormControl( '', [ Validators.required ]),
    con_partiobs5:              new FormControl( '', [ Validators.required ]),
    interes_aprender_enobs1:    new FormControl( '', [ Validators.required ]),
    interes_aprender_enobs2:    new FormControl( '', [ Validators.required ]),
    interes_aprender_enobs3:    new FormControl( '', [ Validators.required ]),
    interes_aprender_enobs4:    new FormControl( '', [ Validators.required ]),
    posee_iniciativa_conobs1:    new FormControl( '', [ Validators.required ]),
    posee_iniciativa_conobs2:    new FormControl( '', [ Validators.required ]),
    posee_iniciativa_conobs3:    new FormControl( '', [ Validators.required ]),
    posee_iniciativa_conobs4:    new FormControl( '', [ Validators.required ]),
    posee_iniciativa_conobs5:    new FormControl( '', [ Validators.required ]),
    demuestra_eficazobs1:    new FormControl( '', [ Validators.required ]),
    demuestra_eficazobs2:    new FormControl( '', [ Validators.required ]),
    demuestra_eficazobs3:    new FormControl( '', [ Validators.required ]),
    demuestra_eficazobs4:    new FormControl( '', [ Validators.required ]),
    demuestra_eficazobs5:    new FormControl( '', [ Validators.required ]),
    observaciones_generales:   new FormControl( '', [ Validators.required ])
  });

  public codCia = environment.codCia; 

  constructor( private actividades:  GenerarActividadService ) { }

  ngOnInit(): void {
    this.obtenerEstudiante()
    this.addCalificacion('con_parti')
    this.addCalificacion('interes_aprender_en')
    this.addCalificacion('posee_iniciativa_con')
    this.addCalificacion('demuestra_compromiso')
    this.addCalificacion('es_constante')
    this.addCalificacion('cumple_exactitud_esm')
    this.addCalificacion('actua_voluntariamente')
    this.addCalificacion('cumple_exactitud_esm')
    this.addCalificacion('actua_voluntariamente')
    this.addCalificacion('coopera_manera')
    this.addCalificacion('es_habil_para')
    this.addCalificacion('actitud_positiva')
    this.addCalificacion('es_respetuoso')
    this.addCalificacion('demuestra_capacidad_en')
    this.addCalificacion('demuestra_habilidades_lid')
    this.addCalificacion('demuestra_cuidadoso_en')
    this.addCalificacion('demuestra_eficaz')
    this.addCalificacion('es_creativo_prop')
    this.addCalificacion('es_perseverante_cu')
    this.addCalificacion('es_puntual_en')
  }


  /**ESTA FUNCIONA HASTA AHORA */
  // downloadPDF(titulo:any) {
  //   var doc = new jsPDF();
  //   const canvas = document.createElement('canvas');
  //   canvas.width = this.content.nativeElement.offsetWidth;
  //   canvas.height = this.content.nativeElement.offsetHeight;
  //   const htmlElement = this.content.nativeElement;
  //   html2canvas(htmlElement).then(canvas => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const imgProps = doc.getImageProperties(imgData);
  //     const pdfWidth = doc.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     doc.save(titulo+'.pdf');
  //   });
  // }

  downloadPDF(titulo: any) {
    const doc = new jsPDF();
  
    const canvas = document.createElement('canvas');
    canvas.width = this.content.nativeElement.offsetWidth;
    canvas.height = this.content.nativeElement.offsetHeight;
    
    const htmlElement = this.content.nativeElement;
    
    html2canvas(htmlElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      
      // Use a promise to wait for the image to load before continuing
      const loadImage = (src: string) => {
        return new Promise((resolve, reject) => {
          const img:any = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
          
          // console.log('IMG')
          // console.log(img)
        });
      };
  
      loadImage(imgData).then((img:any) => {
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = img.height * imgWidth / img.width;
        let offset = 0;
  
        // Add each page to the PDF
        while (offset < img.height) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          // canvas.height = Math.min(img.height - offset, imgHeight);
          canvas.height = 1050
          
          const context: any = canvas.getContext('2d');
  
          context.drawImage(img, 0, offset, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
          const imgDataResized = canvas.toDataURL('image/png');
          
          doc.addImage(imgDataResized, 'PNG', 0, 0, imgWidth, 0, undefined, 'FAST');
          offset += canvas.height;
  
          if (offset < img.height) {
            // doc.moveTo(0, 100);
            doc.addPage();
          }
        }
  
        doc.save(titulo + '.pdf');
      });
    });
  }

  // public downloadPDF(titulo:any): void {
  //   const doc = new jsPDF();
  //   setTimeout(() => {
  //   const content = this.content.nativeElement;
  //   html2canvas(content).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const imgProps = doc.getImageProperties(imgData);
  //     const pdfWidth = doc.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     doc.html(content.innerHTML, {
  //       callback: () => {
  //         doc.save(titulo+'.pdf');
  //       },
  //       x: 0,
  //       y: 0,
  //       html2canvas: {
  //         scale: 1,
  //         width: pdfWidth,
  //         height: pdfHeight,
  //         x: 0,
  //         y: 0,
  //         canvas: canvas,
  //       },
  //     });
  //   });
  //   }, 2500)
  // }


  // downloadPDF(titulo:any) {
  //   const doc = new jsPDF();

  //   // Get the content of the report template
  //   const reportContent = this.content.nativeElement;

  //   // Set the page height and width
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   const pageWidth = doc.internal.pageSize.getWidth();

  //   // Split the report content into multiple pages if needed
  //   const contentSplit = doc.splitTextToSize(reportContent.innerHTML, pageWidth - 20);
  //   const pageCount = contentSplit.length;
  //   let currentPosition = 10;
  //   let i = 0;

  //   // Loop through each page and add it to the PDF
  //   while (i < pageCount) {
  //     // Add the content to the current page
  //     doc.text(10, currentPosition, contentSplit[i]);

  //     // Increment the current position and page count
  //     currentPosition += 10;
  //     i++;

  //     // Add a new page if needed
  //     if (i < pageCount) {
  //       doc.addPage();
  //       currentPosition = 10;
  //     }
  //   }

  //   // Save the PDF
  //   doc.save(titulo+'.pdf');
  // }


  addCalificacion(item: string) {

    switch(item) {
      case 'con_parti':
        // #region Los conocimientos del practicante aseguran una exitosa realización de los trabajos
        this.conprac_1_obs = this.validacionForm.controls['con_partiobs1'].value;
        this.conprac_2_obs = this.validacionForm.controls['con_partiobs2'].value;
        this.conprac_3_obs = this.validacionForm.controls['con_partiobs3'].value;
        this.conprac_4_obs = this.validacionForm.controls['con_partiobs4'].value;
        this.conprac_5_obs = this.validacionForm.controls['con_partiobs5'].value;
        console.warn(this.validacionForm.controls['con_partiobs5'].value);
        if( this.validacionForm.controls['con_parti'].value == 1 ) {
          this.conprac_1 = 'cancel';          
          this.conprac_2 = '';
          this.conprac_3 = '';
          this.conprac_4 = '';
          this.conprac_5 = '';
        }
        if( this.validacionForm.controls['con_parti'].value == 2 ) {
          this.conprac_1 = '';
          this.conprac_2 = 'cancel';
          this.conprac_3 = '';
          this.conprac_4 = '';
          this.conprac_5 = '';
        }
        if( this.validacionForm.controls['con_parti'].value == 3 ) {
          this.conprac_1 = '';
          this.conprac_2 = '';
          this.conprac_3 = 'cancel';
          this.conprac_4 = '';
          this.conprac_5 = '';
        }
        if( this.validacionForm.controls['con_parti'].value == 4 ) {
          this.conprac_1 = '';
          this.conprac_2 = '';
          this.conprac_3 = '';
          this.conprac_4 = 'cancel';
          this.conprac_5 = '';
        }
        if( this.validacionForm.controls['con_parti'].value == 5 ) {
          this.conprac_1 = '';
          this.conprac_2 = '';
          this.conprac_3 = '';
          this.conprac_4 = '';
          this.conprac_5 = 'cancel';
        }
        //#endregion
        break;
      case 'interes_aprender_en':
        // #region Demuestra interés y entusiasmo en aprender
        this.demcomp_1_obs = this.validacionForm.controls['interes_aprender_enobs1'].value;
        this.demcomp_2_obs = this.validacionForm.controls['interes_aprender_enobs2'].value;
        this.demcomp_3_obs = this.validacionForm.controls['interes_aprender_enobs3'].value;
        this.demcomp_4_obs = this.validacionForm.controls['interes_aprender_enobs4'].value;

        if( this.validacionForm.controls['interes_aprender_en'].value == 1 ) {
          this.demin_1 = 'cancel';
          this.demin_2 = '';
          this.demin_3 = '';
          this.demin_4 = '';
          this.demin_5 = '';
        }
        if( this.validacionForm.controls['interes_aprender_en'].value == 2 ) {
          this.demin_1 = '';
          this.demin_2 = 'cancel';
          this.demin_3 = '';
          this.demin_4 = '';
          this.demin_5 = '';
        }
        if( this.validacionForm.controls['interes_aprender_en'].value == 3 ) {
          this.demin_1 = '';
          this.demin_2 = '';
          this.demin_3 = 'cancel';
          this.demin_4 = '';
          this.demin_5 = '';
        }
        if( this.validacionForm.controls['interes_aprender_en'].value == 4 ) {
          this.demin_1 = '';
          this.demin_2 = '';
          this.demin_3 = '';
          this.demin_4 = 'cancel';
          this.demin_5 = '';
        }
        if( this.validacionForm.controls['interes_aprender_en'].value == 5 ) {
          this.demin_1 = '';
          this.demin_2 = '';
          this.demin_3 = '';
          this.demin_4 = '';
          this.demin_5 = 'cancel';
        }
        //#endregion
        break;
      case 'posee_iniciativa_con':
        // #region Posee iniciativa, constantemente pregunta por nuevos trabajos

        this.posini_1_obs = this.validacionForm.controls['posee_iniciativa_conobs1'].value;
        this.posini_2_obs = this.validacionForm.controls['posee_iniciativa_conobs2'].value;
        this.posini_3_obs = this.validacionForm.controls['posee_iniciativa_conobs3'].value;
        this.posini_4_obs = this.validacionForm.controls['posee_iniciativa_conobs4'].value;
        this.posini_5_obs = this.validacionForm.controls['posee_iniciativa_conobs5'].value;

        if( this.validacionForm.controls['posee_iniciativa_con'].value == 1 ) {
          this.posini_1 = 'cancel';
          this.posini_2 = '';
          this.posini_3 = '';
          this.posini_4 = '';
          this.posini_5 = '';
        }
        if( this.validacionForm.controls['posee_iniciativa_con'].value == 2 ) {
          this.posini_1 = '';
          this.posini_2 = 'cancel';
          this.posini_3 = '';
          this.posini_4 = '';
          this.posini_5 = '';
        }
        if( this.validacionForm.controls['posee_iniciativa_con'].value == 3 ) {
          this.posini_1 = '';
          this.posini_2 = '';
          this.posini_3 = 'cancel';
          this.posini_4 = '';
          this.posini_5 = '';
        }
        if( this.validacionForm.controls['posee_iniciativa_con'].value == 4 ) {
          this.posini_1 = '';
          this.posini_2 = '';
          this.posini_3 = '';
          this.posini_4 = 'cancel';
          this.posini_5 = '';
        }
        if( this.validacionForm.controls['posee_iniciativa_con'].value == 5 ) {
          this.posini_1 = '';
          this.posini_2 = '';
          this.posini_3 = '';
          this.posini_4 = '';
          this.posini_5 = 'cancel';
        }
        //#endregion
        break;
      case 'demuestra_capacidad_en':
        // #region Demuestra capacidad en la realización de sus trabajos
        if( this.validacionForm.controls['demuestra_capacidad_en'].value == 1 ) {
          this.decap_1 = 'cancel';
          this.decap_2 = '';
          this.decap_3 = '';
          this.decap_4 = '';
          this.decap_5 = '';
        }
        if( this.validacionForm.controls['demuestra_capacidad_en'].value == 2 ) {
          this.decap_1 = '';
          this.decap_2 = 'cancel';
          this.decap_3 = '';
          this.decap_4 = '';
          this.decap_5 = '';
        }
        if( this.validacionForm.controls['demuestra_capacidad_en'].value == 3 ) {
          this.decap_1 = '';
          this.decap_2 = '';
          this.decap_3 = 'cancel';
          this.decap_4 = '';
          this.decap_5 = '';
        }
        if( this.validacionForm.controls['demuestra_capacidad_en'].value == 4 ) {
          this.decap_1 = '';
          this.decap_2 = '';
          this.decap_3 = '';
          this.decap_4 = 'cancel';
          this.decap_5 = '';
        }
        if( this.validacionForm.controls['demuestra_capacidad_en'].value == 5 ) {
          this.decap_1 = '';
          this.decap_2 = '';
          this.decap_3 = '';
          this.decap_4 = '';
          this.decap_5 = 'cancel';
        }
        //#endregion
        break;
      case 'es_habil_para':
        // #region Es hábil para poner en práctica ideas propias o ajenas
        if( this.validacionForm.controls['es_habil_para'].value == 1 ) {
          this.habpar_1 = 'cancel';
          this.habpar_2 = '';
          this.habpar_3 = '';
          this.habpar_4 = '';
          this.habpar_5 = '';
        }
        if( this.validacionForm.controls['es_habil_para'].value == 2 ) {
          this.habpar_1 = '';
          this.habpar_2 = 'cancel';
          this.habpar_3 = '';
          this.habpar_4 = '';
          this.habpar_5 = '';
        }
        if( this.validacionForm.controls['es_habil_para'].value == 3 ) {
          this.habpar_1 = '';
          this.habpar_2 = '';
          this.habpar_3 = 'cancel';
          this.habpar_4 = '';
          this.habpar_5 = '';
        }
        if( this.validacionForm.controls['es_habil_para'].value == 4 ) {
          this.habpar_1 = '';
          this.habpar_2 = '';
          this.habpar_3 = '';
          this.habpar_4 = 'cancel';
          this.habpar_5 = '';
        }
        if( this.validacionForm.controls['es_habil_para'].value == 5 ) {
          this.habpar_1 = '';
          this.habpar_2 = '';
          this.habpar_3 = '';
          this.habpar_4 = '';
          this.habpar_5 = 'cancel';
        }
        //#endregion
        break;
      case 'demuestra_compromiso':
        // #region Demuestra compromiso en la realización de sus trabajos
        if( this.validacionForm.controls['demuestra_compromiso'].value == 1 ) {
          this.demcomp_1 = 'cancel';
          this.demcomp_2 = '';
          this.demcomp_3 = '';
          this.demcomp_4 = '';
          this.demcomp_5 = '';
        }
        if( this.validacionForm.controls['demuestra_compromiso'].value == 2 ) {
          this.demcomp_1 = '';
          this.demcomp_2 = 'cancel';
          this.demcomp_3 = '';
          this.demcomp_4 = '';
          this.demcomp_5 = '';
        }
        if( this.validacionForm.controls['demuestra_compromiso'].value == 3 ) {
          this.demcomp_1 = '';
          this.demcomp_2 = '';
          this.demcomp_3 = 'cancel';
          this.demcomp_4 = '';
          this.demcomp_5 = '';
        }
        if( this.validacionForm.controls['demuestra_compromiso'].value == 4 ) {
          this.demcomp_1 = '';
          this.demcomp_2 = '';
          this.demcomp_3 = '';
          this.demcomp_4 = 'cancel';
          this.demcomp_5 = '';
        }
        if( this.validacionForm.controls['demuestra_compromiso'].value == 5 ) {
          this.demcomp_1 = '';
          this.demcomp_2 = '';
          this.demcomp_3 = '';
          this.demcomp_4 = '';
          this.demcomp_5 = 'cancel';
        }
        //#endregion
        break;
      case 'es_constante':
        // #region Es constante y siempre muy predispuesto a desempeñar la labor
        if( this.validacionForm.controls['es_constante'].value == 1 ) {
          this.econst_1 = 'cancel';
          this.econst_2 = '';
          this.econst_3 = '';
          this.econst_4 = '';
          this.econst_5 = '';
        }
        if( this.validacionForm.controls['es_constante'].value == 2 ) {
          this.econst_1 = '';
          this.econst_2 = 'cancel';
          this.econst_3 = '';
          this.econst_4 = '';
          this.econst_5 = '';
        }
        if( this.validacionForm.controls['es_constante'].value == 3 ) {
          this.econst_1 = '';
          this.econst_2 = '';
          this.econst_3 = 'cancel';
          this.econst_4 = '';
          this.econst_5 = '';
        }
        if( this.validacionForm.controls['es_constante'].value == 4 ) {
          this.econst_1 = '';
          this.econst_2 = '';
          this.econst_3 = '';
          this.econst_4 = 'cancel';
          this.econst_5 = '';
        }
        if( this.validacionForm.controls['es_constante'].value == 5 ) {
          this.econst_1 = '';
          this.econst_2 = '';
          this.econst_3 = '';
          this.econst_4 = '';
          this.econst_5 = 'cancel';
        }
        //#endregion
        break;
      case 'cumple_exactitud_esm':
        // #region Cumple con exactitud, esmero y orden los trabajos
        if( this.validacionForm.controls['cumple_exactitud_esm'].value == 1 ) {
          this.cumpex_1 = 'cancel';
          this.cumpex_2 = '';
          this.cumpex_3 = '';
          this.cumpex_4 = '';
          this.cumpex_5 = '';
        }
        if( this.validacionForm.controls['cumple_exactitud_esm'].value == 2 ) {
          this.cumpex_1 = '';
          this.cumpex_2 = 'cancel';
          this.cumpex_3 = '';
          this.cumpex_4 = '';
          this.cumpex_5 = '';
        }
        if( this.validacionForm.controls['cumple_exactitud_esm'].value == 3 ) {
          this.cumpex_1 = '';
          this.cumpex_2 = '';
          this.cumpex_3 = 'cancel';
          this.cumpex_4 = '';
          this.cumpex_5 = '';
        }
        if( this.validacionForm.controls['cumple_exactitud_esm'].value == 4 ) {
          this.cumpex_1 = '';
          this.cumpex_2 = '';
          this.cumpex_3 = '';
          this.cumpex_4 = 'cancel';
          this.cumpex_5 = '';
        }
        if( this.validacionForm.controls['cumple_exactitud_esm'].value == 5 ) {
          this.cumpex_1 = '';
          this.cumpex_2 = '';
          this.cumpex_3 = '';
          this.cumpex_4 = '';
          this.cumpex_5 = 'cancel';
        }
        //#endregion
        break;
      case 'actua_voluntariamente':
        // #region Actúa voluntariamente en los trabajos de rutina
        if( this.validacionForm.controls['actua_voluntariamente'].value == 1 ) {
          this.acvont_1 = 'cancel';
          this.acvont_2 = '';
          this.acvont_3 = '';
          this.acvont_4 = '';
          this.acvont_5 = '';
        }
        if( this.validacionForm.controls['actua_voluntariamente'].value == 2 ) {
          this.acvont_1 = '';
          this.acvont_2 = 'cancel';
          this.acvont_3 = '';
          this.acvont_4 = '';
          this.acvont_5 = '';
        }
        if( this.validacionForm.controls['actua_voluntariamente'].value == 3 ) {
          this.acvont_1 = '';
          this.acvont_2 = '';
          this.acvont_3 = 'cancel';
          this.acvont_4 = '';
          this.acvont_5 = '';
        }
        if( this.validacionForm.controls['actua_voluntariamente'].value == 4 ) {
          this.acvont_1 = '';
          this.acvont_2 = '';
          this.acvont_3 = '';
          this.acvont_4 = 'cancel';
          this.acvont_5 = '';
        }
        if( this.validacionForm.controls['actua_voluntariamente'].value == 5 ) {
          this.acvont_1 = '';
          this.acvont_2 = '';
          this.acvont_3 = '';
          this.acvont_4 = '';
          this.acvont_5 = 'cancel';
        }
        //#endregion
        break;
      case 'actitud_positiva':
        // #region Su actitud es proactiva y facilita la tarea en equipo
        if( this.validacionForm.controls['actitud_positiva'].value == 1 ) {
          this.actituproa_1 = 'cancel';
          this.actituproa_2 = '';
          this.actituproa_3 = '';
          this.actituproa_4 = '';
          this.actituproa_5 = '';
        }
        if( this.validacionForm.controls['actitud_positiva'].value == 2 ) {
          this.actituproa_1 = '';
          this.actituproa_2 = 'cancel';
          this.actituproa_3 = '';
          this.actituproa_4 = '';
          this.actituproa_5 = '';
        }
        if( this.validacionForm.controls['actitud_positiva'].value == 3 ) {
          this.actituproa_1 = '';
          this.actituproa_2 = '';
          this.actituproa_3 = 'cancel';
          this.actituproa_4 = '';
          this.actituproa_5 = '';
        }
        if( this.validacionForm.controls['actitud_positiva'].value == 4 ) {
          this.actituproa_1 = '';
          this.actituproa_2 = '';
          this.actituproa_3 = '';
          this.actituproa_4 = 'cancel';
          this.actituproa_5 = '';
        }
        if( this.validacionForm.controls['actitud_positiva'].value == 5 ) {
          this.actituproa_1 = '';
          this.actituproa_2 = '';
          this.actituproa_3 = '';
          this.actituproa_4 = '';
          this.actituproa_5 = 'cancel';
        }
        //#endregion
        break;
      case 'coopera_manera':
        // #region Coopera de manera permanente y espontánea
        if( this.validacionForm.controls['coopera_manera'].value == 1 ) {
          this.copperm_1 = 'cancel';
          this.copperm_2 = '';
          this.copperm_3 = '';
          this.copperm_4 = '';
          this.copperm_5 = '';
        }
        if( this.validacionForm.controls['coopera_manera'].value == 2 ) {
          this.copperm_1 = '';
          this.copperm_2 = 'cancel';
          this.copperm_3 = '';
          this.copperm_4 = '';
          this.copperm_5 = '';
        }
        if( this.validacionForm.controls['coopera_manera'].value == 3 ) {
          this.copperm_1 = '';
          this.copperm_2 = '';
          this.copperm_3 = 'cancel';
          this.copperm_4 = '';
          this.copperm_5 = '';
        }
        if( this.validacionForm.controls['coopera_manera'].value == 4 ) {
          this.copperm_1 = '';
          this.copperm_2 = '';
          this.copperm_3 = '';
          this.copperm_4 = 'cancel';
          this.copperm_5 = '';
        }
        if( this.validacionForm.controls['coopera_manera'].value == 5 ) {
          this.copperm_1 = '';
          this.copperm_2 = '';
          this.copperm_3 = '';
          this.copperm_4 = '';
          this.copperm_5 = 'cancel';
        }
        //#endregion
        break;
      case 'es_respetuoso':
        // #region Es respetuos@
        if( this.validacionForm.controls['es_respetuoso'].value == 1 ) {
          this.respe_1 = 'cancel';
          this.respe_2 = '';
          this.respe_3 = '';
          this.respe_4 = '';
          this.respe_5 = '';
        }
        if( this.validacionForm.controls['es_respetuoso'].value == 2 ) {
          this.respe_1 = '';
          this.respe_2 = 'cancel';
          this.respe_3 = '';
          this.respe_4 = '';
          this.respe_5 = '';
        }
        if( this.validacionForm.controls['es_respetuoso'].value == 3 ) {
          this.respe_1 = '';
          this.respe_2 = '';
          this.respe_3 = 'cancel';
          this.respe_4 = '';
          this.respe_5 = '';
        }
        if( this.validacionForm.controls['es_respetuoso'].value == 4 ) {
          this.respe_1 = '';
          this.respe_2 = '';
          this.respe_3 = '';
          this.respe_4 = 'cancel';
          this.respe_5 = '';
        }
        if( this.validacionForm.controls['es_respetuoso'].value == 5 ) {
          this.respe_1 = '';
          this.respe_2 = '';
          this.respe_3 = '';
          this.respe_4 = '';
          this.respe_5 = 'cancel';
        }
        //#endregion
        break;
      case 'demuestra_habilidades_lid':
        // #region Demuestra habilidades de liderazgo en los trabajos en equipo
        if( this.validacionForm.controls['demuestra_habilidades_lid'].value == 1 ) {
          this.demuha_1 = 'cancel';
          this.demuha_2 = '';
          this.demuha_3 = '';
          this.demuha_4 = '';
          this.demuha_5 = '';
        }
        if( this.validacionForm.controls['demuestra_habilidades_lid'].value == 2 ) {
          this.demuha_1 = '';
          this.demuha_2 = 'cancel';
          this.demuha_3 = '';
          this.demuha_4 = '';
          this.demuha_5 = '';
        }
        if( this.validacionForm.controls['demuestra_habilidades_lid'].value == 3 ) {
          this.demuha_1 = '';
          this.demuha_2 = '';
          this.demuha_3 = 'cancel';
          this.demuha_4 = '';
          this.demuha_5 = '';
        }
        if( this.validacionForm.controls['demuestra_habilidades_lid'].value == 4 ) {
          this.demuha_1 = '';
          this.demuha_2 = '';
          this.demuha_3 = '';
          this.demuha_4 = 'cancel';
          this.demuha_5 = '';
        }
        if( this.validacionForm.controls['demuestra_habilidades_lid'].value == 5 ) {
          this.demuha_1 = '';
          this.demuha_2 = '';
          this.demuha_3 = '';
          this.demuha_4 = '';
          this.demuha_5 = 'cancel';
        }
        //#endregion
        break;
      case 'demuestra_cuidadoso_en':
        // #region Demuestra ser cuidadoso en su presentación personal
        if( this.validacionForm.controls['demuestra_cuidadoso_en'].value == 1 ) {
          this.demupres_1 = 'cancel';
          this.demupres_2 = '';
          this.demupres_3 = '';
          this.demupres_4 = '';
          this.demupres_5 = '';
        }
        if( this.validacionForm.controls['demuestra_cuidadoso_en'].value == 2 ) {
          this.demupres_1 = '';
          this.demupres_2 = 'cancel';
          this.demupres_3 = '';
          this.demupres_4 = '';
          this.demupres_5 = '';
        }
        if( this.validacionForm.controls['demuestra_cuidadoso_en'].value == 3 ) {
          this.demupres_1 = '';
          this.demupres_2 = '';
          this.demupres_3 = 'cancel';
          this.demupres_4 = '';
          this.demupres_5 = '';
        }
        if( this.validacionForm.controls['demuestra_cuidadoso_en'].value == 4 ) {
          this.demupres_1 = '';
          this.demupres_2 = '';
          this.demupres_3 = '';
          this.demupres_4 = 'cancel';
          this.demupres_5 = '';
        }
        if( this.validacionForm.controls['demuestra_cuidadoso_en'].value == 5 ) {
          this.demupres_1 = '';
          this.demupres_2 = '';
          this.demupres_3 = '';
          this.demupres_4 = '';
          this.demupres_5 = 'cancel';
        }
        //#endregion
        break;
      case 'demuestra_eficaz':
        // #region Demuestra ser eficaz en el análisis y resolución de problemas
        this.demuefic_1_obs = this.validacionForm.controls['demuestra_eficazobs1'].value;
        this.demuefic_2_obs = this.validacionForm.controls['demuestra_eficazobs2'].value;
        this.demuefic_3_obs = this.validacionForm.controls['demuestra_eficazobs3'].value;
        this.demuefic_4_obs = this.validacionForm.controls['demuestra_eficazobs4'].value;
        
        if( this.validacionForm.controls['demuestra_eficaz'].value == 1 ) {
          this.demuefic_1 = 'cancel';
          this.demuefic_2 = '';
          this.demuefic_3 = '';
          this.demuefic_4 = '';
          this.demuefic_5 = '';
        }
        if( this.validacionForm.controls['demuestra_eficaz'].value == 2 ) {
          this.demuefic_1 = '';
          this.demuefic_2 = 'cancel';
          this.demuefic_3 = '';
          this.demuefic_4 = '';
          this.demuefic_5 = '';
        }
        if( this.validacionForm.controls['demuestra_eficaz'].value == 3 ) {
          this.demuefic_1 = '';
          this.demuefic_2 = '';
          this.demuefic_3 = 'cancel';
          this.demuefic_4 = '';
          this.demuefic_5 = '';
        }
        if( this.validacionForm.controls['demuestra_eficaz'].value == 4 ) {
          this.demuefic_1 = '';
          this.demuefic_2 = '';
          this.demuefic_3 = '';
          this.demuefic_4 = 'cancel';
          this.demuefic_5 = '';
        }
        //#endregion
        break;
      case 'es_creativo_prop':
        // #region Es creativo y propone soluciones y/o alternativas para mejorar situaciones de trabajo
        if( this.validacionForm.controls['es_creativo_prop'].value == 1 ) {
          this.creapro_1 = 'cancel';
          this.creapro_2 = '';
          this.creapro_3 = '';
          this.creapro_4 = '';
          this.creapro_5 = '';
        }
        if( this.validacionForm.controls['es_creativo_prop'].value == 2 ) {
          this.creapro_1 = '';
          this.creapro_2 = 'cancel';
          this.creapro_3 = '';
          this.creapro_4 = '';
          this.creapro_5 = '';
        }
        if( this.validacionForm.controls['es_creativo_prop'].value == 3 ) {
          this.creapro_1 = '';
          this.creapro_2 = '';
          this.creapro_3 = 'cancel';
          this.creapro_4 = '';
          this.creapro_5 = '';
        }
        if( this.validacionForm.controls['es_creativo_prop'].value == 4 ) {
          this.creapro_1 = '';
          this.creapro_2 = '';
          this.creapro_3 = '';
          this.creapro_4 = 'cancel';
          this.creapro_5 = '';
        }
        if( this.validacionForm.controls['es_creativo_prop'].value == 5 ) {
          this.creapro_1 = '';
          this.creapro_2 = '';
          this.creapro_3 = '';
          this.creapro_4 = '';
          this.creapro_5 = 'cancel';
        }
        //#endregion
        break;
      case 'es_perseverante_cu':
        // #region Es perseverante, cuando debe enfrentar situaciones difíciles de trabajo, hasta que éste quede resuelto
        if( this.validacionForm.controls['es_perseverante_cu'].value == 1 ) {
          this.persevenf_1 = 'cancel';
          this.persevenf_2 = '';
          this.persevenf_3 = '';
          this.persevenf_4 = '';
          this.persevenf_5 = '';
        }
        if( this.validacionForm.controls['es_perseverante_cu'].value == 2 ) {
          this.persevenf_1 = '';
          this.persevenf_2 = 'cancel';
          this.persevenf_3 = '';
          this.persevenf_4 = '';
          this.persevenf_5 = '';
        }
        if( this.validacionForm.controls['es_perseverante_cu'].value == 3 ) {
          this.persevenf_1 = '';
          this.persevenf_2 = '';
          this.persevenf_3 = 'cancel';
          this.persevenf_4 = '';
          this.persevenf_5 = '';
        }
        if( this.validacionForm.controls['es_perseverante_cu'].value == 4 ) {
          this.persevenf_1 = '';
          this.persevenf_2 = '';
          this.persevenf_3 = '';
          this.persevenf_4 = 'cancel';
          this.persevenf_5 = '';
        }
        if( this.validacionForm.controls['es_perseverante_cu'].value == 5 ) {
          this.persevenf_1 = '';
          this.persevenf_2 = '';
          this.persevenf_3 = '';
          this.persevenf_4 = '';
          this.persevenf_5 = 'cancel';
        }
        //#endregion
        break;
      case 'es_puntual_en':
        // #region Es puntual en el trabajo
        if( this.validacionForm.controls['es_puntual_en'].value == 1 ) {
          this.putrab_1 = 'cancel';
          this.putrab_2 = '';
          this.putrab_3 = '';
          this.putrab_4 = '';
          this.putrab_5 = '';
        }
        if( this.validacionForm.controls['es_puntual_en'].value == 2 ) {
          this.putrab_1 = '';
          this.putrab_2 = 'cancel';
          this.putrab_3 = '';
          this.putrab_4 = '';
          this.putrab_5 = '';
        }
        if( this.validacionForm.controls['es_puntual_en'].value == 3 ) {
          this.putrab_1 = '';
          this.putrab_2 = '';
          this.putrab_3 = 'cancel';
          this.putrab_4 = '';
          this.putrab_5 = '';
        }
        if( this.validacionForm.controls['es_puntual_en'].value == 4 ) {
          this.putrab_1 = '';
          this.putrab_2 = '';
          this.putrab_3 = '';
          this.putrab_4 = 'cancel';
          this.putrab_5 = '';
        }
        if( this.validacionForm.controls['es_puntual_en'].value == 5 ) {
          this.putrab_1 = '';
          this.putrab_2 = '';
          this.putrab_3 = '';
          this.putrab_4 = '';
          this.putrab_5 = 'cancel';
        }
        //#endregion
        break;
      case 'observaciones_generales':
        this.obs_generales = this.validacionForm.controls['observaciones_generales'].value;
        break;
      default:
        // #region 
        this.conprac_3    = 'cancel';
        this.demin_3      = 'cancel';
        this.posini_3     = 'cancel';
        this.decap_3      = 'cancel';
        this.habpar_3     = 'cancel';
        this.demcomp_3    = 'cancel';
        this.econst_3     = 'cancel';
        this.cumpex_3     = 'cancel';
        this.acvont_3     = 'cancel';
        this.actituproa_3 = 'cancel';
        this.copperm_3    = 'cancel';
        this.respe_3      = 'cancel';
        this.demuha_3     = 'cancel';
        this.demupres_3   = 'cancel';
        this.demuefic_3   = 'cancel';
        this.creapro_3    = 'cancel';
        this.persevenf_3  = 'cancel';
        this.putrab_3     = 'cancel';
        // #endregion
        break;
      
    }

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
          this.provinicaInstituto = element.provinicaInstituto;      
          this._nombreInstituto = element.nombreInstituto;      
        })
      }
    })
  }

  dataSend(tipo:number) {
    
    switch(tipo) {
      case 1:
        this.conocimientos_practicante = this.validacionForm.controls['con_parti'].value;
        this.addCalificacion('con_parti');
        break;
      case 2:
        this.interes_aprender          = this.validacionForm.controls['interes_aprender_en'].value;
        this.addCalificacion('interes_aprender_en');
        break;
      case 3:
        this.posee_iniciativa          = this.validacionForm.controls['posee_iniciativa_con'].value;
        this.addCalificacion('posee_iniciativa_con');
        break;
      case 4:
        this.demuestra_capacidad       = this.validacionForm.controls['demuestra_capacidad_en'].value;
        this.addCalificacion('demuestra_capacidad_en');
        break;
      case 5:
        this.es_habil                  = this.validacionForm.controls['es_habil_para'].value;
        this.addCalificacion('es_habil_para');
        break;
      case 6:
        this.demuestra_comprom         = this.validacionForm.controls['demuestra_compromiso'].value;
        this.addCalificacion('demuestra_compromiso');
        break;
      case 7:
        this.es_constante_y            = this.validacionForm.controls['es_constante'].value;
        this.addCalificacion('es_constante');
        break;
      case 8:
        this.cumple_exactitud          = this.validacionForm.controls['cumple_exactitud_esm'].value;
        this.addCalificacion('cumple_exactitud_esm');
        break;
      case 9:
        this.actua_voluntariamente_en  = this.validacionForm.controls['actua_voluntariamente'].value;
        this.addCalificacion('actua_voluntariamente');
        break;
      case 10:
        this.actitud_posi              = this.validacionForm.controls['actitud_positiva'].value;
        this.addCalificacion('actitud_positiva');
        break;
      case 11:
        this.coopera_manera_perm       = this.validacionForm.controls['coopera_manera'].value;
        this.addCalificacion('coopera_manera');
        break;
      case 12:
        this.es_resp                   = this.validacionForm.controls['es_respetuoso'].value;
        this.addCalificacion('es_respetuoso');
        break;
      case 13:
        this.demuestra_habilidades     = this.validacionForm.controls['demuestra_habilidades_lid'].value;
        this.addCalificacion('demuestra_habilidades_lid');
        break;
      case 14:
        this.demuestra_cuidadoso       = this.validacionForm.controls['demuestra_cuidadoso_en'].value;
        this.addCalificacion('demuestra_cuidadoso_en');
        break;
      case 15:
        this.demuestra_eficaz_en       = this.validacionForm.controls['demuestra_eficaz'].value;
        this.addCalificacion('demuestra_eficaz');
        break;
      case 16:
        this.es_creativo_propone       = this.validacionForm.controls['es_creativo_prop'].value;
        this.addCalificacion('es_creativo_prop');
        break;
      case 17:
        this.es_perseverante           = this.validacionForm.controls['es_perseverante_cu'].value;
        this.addCalificacion('es_perseverante_cu');
        break;
      case 18:
        this.es_puntual                = this.validacionForm.controls['es_puntual_en'].value;
        this.addCalificacion('es_puntual_en');
        break;
    }

  }

  onSubmit() {
    console.warn(this.validacionForm);
  }

}
