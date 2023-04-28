import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarProyectosComponent } from './generar-proyectos.component';

describe('GenerarProyectosComponent', () => {
  let component: GenerarProyectosComponent;
  let fixture: ComponentFixture<GenerarProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerarProyectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
