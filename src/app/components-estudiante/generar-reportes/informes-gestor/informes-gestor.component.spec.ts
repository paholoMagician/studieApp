import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesGestorComponent } from './informes-gestor.component';

describe('InformesGestorComponent', () => {
  let component: InformesGestorComponent;
  let fixture: ComponentFixture<InformesGestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformesGestorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesGestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
