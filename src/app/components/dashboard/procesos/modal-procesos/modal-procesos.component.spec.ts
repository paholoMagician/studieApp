import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProcesosComponent } from './modal-procesos.component';

describe('ModalProcesosComponent', () => {
  let component: ModalProcesosComponent;
  let fixture: ComponentFixture<ModalProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalProcesosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
