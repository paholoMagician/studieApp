import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavSideComponent } from '../../shared/nav-side/nav-side.component';
//#region Angular Material
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard.component';
import { RegistrovinculacionComponent } from '../../registrovinculacion/registrovinculacion.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EstudiantesComponent } from '../estudiantes/estudiantes.component';
import { PersonalVinculacionComponent } from '../personal-vinculacion/personal-vinculacion.component';
import { DatosPersonalesComponent } from '../datos-personales/datos-personales.component';
import { RegistroBeneficiarioComponent } from '../registro-beneficiario/registro-beneficiario.component';
import { CrearConveniosComponent } from '../crear-convenios/crear-convenios.component';
import { ModalConvenioEspecificosComponent } from '../crear-convenios/modal-convenio-especificos/modal-convenio-especificos.component';
import { GenerarProyectosComponent } from '../generar-proyectos/generar-proyectos.component';
import { ProcesosComponent } from '../procesos/procesos.component';
import { ProyectoPersonalComponent } from '../generar-proyectos/proyecto-personal/proyecto-personal.component';
import { AgruparEstudiantesComponent } from '../../agrupar-estudiantes/agrupar-estudiantes.component';
import { ModalEstudiantesAgruparComponent } from '../../agrupar-estudiantes/modal-estudiantes-agrupar/modal-estudiantes-agrupar.component';
import { ModalProcesosComponent } from '../procesos/modal-procesos/modal-procesos.component';
import { EstudiantesModule } from 'src/app/components-estudiante/module/estudiantes/estudiantes.module';
import { InsitutosMaestroComponent } from '../insitutos-maestro/insitutos-maestro.component';
import { ConfigurationsComponent } from '../../configurations/configurations.component';
import { MiempresaComponent } from '../../miempresa/miempresa.component';
import { ConfigurationLandingComponent } from '../../configurations/configuration-landing/configuration-landing.component';



@NgModule({
  declarations: [
    DashboardComponent,
    NavSideComponent,
    RegistrovinculacionComponent,
    EstudiantesComponent,
    PersonalVinculacionComponent,
    DatosPersonalesComponent,
    RegistroBeneficiarioComponent,
    CrearConveniosComponent,
    ModalConvenioEspecificosComponent,
    GenerarProyectosComponent,
    ProcesosComponent,
    ProyectoPersonalComponent,
    AgruparEstudiantesComponent,
    ModalEstudiantesAgruparComponent,
    ModalProcesosComponent,
    InsitutosMaestroComponent,
    ConfigurationsComponent,
    MiempresaComponent,
    ConfigurationLandingComponent
  ],
  imports: [
    EstudiantesModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //#region 
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule
  ],
  exports: [
    NavSideComponent,
    EstudiantesComponent,
    PersonalVinculacionComponent,
    RegistrovinculacionComponent,
    DatosPersonalesComponent,
    RegistroBeneficiarioComponent,
    CrearConveniosComponent,
    ModalConvenioEspecificosComponent,
    GenerarProyectosComponent,
    ProcesosComponent,
    ProyectoPersonalComponent,
    AgruparEstudiantesComponent,
    ModalEstudiantesAgruparComponent,
    ModalProcesosComponent,
    InsitutosMaestroComponent,
    ConfigurationsComponent,
    MiempresaComponent,
    ConfigurationLandingComponent
  ]
})

export class DashboardModule { }
