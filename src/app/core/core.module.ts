import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AppBarComponent } from './app-bar/app-bar.component';
import { GenerateSetFormComponent } from './generate-set-form/generate-set-form.component';
import { MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatCardModule, MatDividerModule, MatStepperModule } from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppBarComponent,
    GenerateSetFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDividerModule,
    MatStepperModule,
    CoreRoutingModule,
    FormsModule
  ],
  exports: [
    AppBarComponent,
  ]
})
export class CoreModule { }
