import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './home/home.component';
import { AppBarComponent } from './app-bar/app-bar.component';
import { GenerateSetFormComponent } from './generate-set-form/generate-set-form.component';
import { MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatCardModule, MatDividerModule, MatStepperModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
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
    CoreRoutingModule
  ],
  exports: [
    AppBarComponent,
  ]
})
export class CoreModule { }
