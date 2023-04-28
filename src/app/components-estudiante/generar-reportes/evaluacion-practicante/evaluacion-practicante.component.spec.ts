import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionPracticanteComponent } from './evaluacion-practicante.component';

describe('EvaluacionPracticanteComponent', () => {
  let component: EvaluacionPracticanteComponent;
  let fixture: ComponentFixture<EvaluacionPracticanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionPracticanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionPracticanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
