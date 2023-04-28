import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrovinculacionComponent } from './registrovinculacion.component';

describe('RegistrovinculacionComponent', () => {
  let component: RegistrovinculacionComponent;
  let fixture: ComponentFixture<RegistrovinculacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrovinculacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrovinculacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
