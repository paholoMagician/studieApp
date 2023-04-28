import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalVinculacionComponent } from './personal-vinculacion.component';

describe('PersonalVinculacionComponent', () => {
  let component: PersonalVinculacionComponent;
  let fixture: ComponentFixture<PersonalVinculacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalVinculacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalVinculacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
