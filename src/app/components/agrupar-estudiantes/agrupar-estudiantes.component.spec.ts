import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgruparEstudiantesComponent } from './agrupar-estudiantes.component';

describe('AgruparEstudiantesComponent', () => {
  let component: AgruparEstudiantesComponent;
  let fixture: ComponentFixture<AgruparEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgruparEstudiantesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgruparEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
