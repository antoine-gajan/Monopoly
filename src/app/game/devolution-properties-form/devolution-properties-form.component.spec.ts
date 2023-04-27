import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolutionPropertiesFormComponent } from './devolution-properties-form.component';

describe('DevolutionPropertiesFormComponent', () => {
  let component: DevolutionPropertiesFormComponent;
  let fixture: ComponentFixture<DevolutionPropertiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevolutionPropertiesFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolutionPropertiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
