import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearConveniosComponent } from './crear-convenios.component';

describe('CrearConveniosComponent', () => {
  let component: CrearConveniosComponent;
  let fixture: ComponentFixture<CrearConveniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearConveniosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearConveniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
