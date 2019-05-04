import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGenerateSetComponent } from './form-generate-set.component';

describe('FormGenerateSetComponent', () => {
  let component: FormGenerateSetComponent;
  let fixture: ComponentFixture<FormGenerateSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGenerateSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGenerateSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
