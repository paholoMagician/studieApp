import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarReportesComponent } from './generar-reportes.component';

describe('GenerarReportesComponent', () => {
  let component: GenerarReportesComponent;
  let fixture: ComponentFixture<GenerarReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarReportesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
