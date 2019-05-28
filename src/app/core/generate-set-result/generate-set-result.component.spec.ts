import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSetResultComponent } from './generate-set-result.component';

describe('GenerateSetResultComponent', () => {
  let component: GenerateSetResultComponent;
  let fixture: ComponentFixture<GenerateSetResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateSetResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateSetResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
