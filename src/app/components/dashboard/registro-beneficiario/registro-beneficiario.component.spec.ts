import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroBeneficiarioComponent } from './registro-beneficiario.component';

describe('RegistroBeneficiarioComponent', () => {
  let component: RegistroBeneficiarioComponent;
  let fixture: ComponentFixture<RegistroBeneficiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroBeneficiarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
