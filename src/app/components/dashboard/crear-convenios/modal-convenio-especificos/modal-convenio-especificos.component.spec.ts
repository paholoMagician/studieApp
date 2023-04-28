import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConvenioEspecificosComponent } from './modal-convenio-especificos.component';

describe('ModalConvenioEspecificosComponent', () => {
  let component: ModalConvenioEspecificosComponent;
  let fixture: ComponentFixture<ModalConvenioEspecificosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConvenioEspecificosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConvenioEspecificosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
