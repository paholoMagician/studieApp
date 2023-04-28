import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEstudiantesAgruparComponent } from './modal-estudiantes-agrupar.component';

describe('ModalEstudiantesAgruparComponent', () => {
  let component: ModalEstudiantesAgruparComponent;
  let fixture: ComponentFixture<ModalEstudiantesAgruparComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEstudiantesAgruparComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEstudiantesAgruparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
