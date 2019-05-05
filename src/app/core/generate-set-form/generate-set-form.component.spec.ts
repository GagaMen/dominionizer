import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSetFormComponent } from './generate-set-form.component';

describe('GenerateSetFormComponent', () => {
  let component: GenerateSetFormComponent;
  let fixture: ComponentFixture<GenerateSetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateSetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
