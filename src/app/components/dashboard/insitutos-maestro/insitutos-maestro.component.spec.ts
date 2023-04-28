import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsitutosMaestroComponent } from './insitutos-maestro.component';

describe('InsitutosMaestroComponent', () => {
  let component: InsitutosMaestroComponent;
  let fixture: ComponentFixture<InsitutosMaestroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsitutosMaestroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsitutosMaestroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
