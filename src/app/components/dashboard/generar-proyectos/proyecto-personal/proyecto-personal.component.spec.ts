import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProyectoPersonalComponent } from './proyecto-personal.component';

describe('ProyectoPersonalComponent', () => {
  let component: ProyectoPersonalComponent;
  let fixture: ComponentFixture<ProyectoPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProyectoPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProyectoPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
