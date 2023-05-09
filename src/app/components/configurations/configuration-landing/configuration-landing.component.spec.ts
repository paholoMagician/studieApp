import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationLandingComponent } from './configuration-landing.component';

describe('ConfigurationLandingComponent', () => {
  let component: ConfigurationLandingComponent;
  let fixture: ComponentFixture<ConfigurationLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
