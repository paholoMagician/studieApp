import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiempresaComponent } from './miempresa.component';

describe('MiempresaComponent', () => {
  let component: MiempresaComponent;
  let fixture: ComponentFixture<MiempresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiempresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
