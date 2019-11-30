import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionSelectComponent } from './expansion-select.component';

xdescribe('ExpansionSelectComponent', () => {
  let component: ExpansionSelectComponent;
  let fixture: ComponentFixture<ExpansionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
