import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AppBarComponent } from './app-bar/app-bar.component';
import { GenerateSetFormComponent } from './generate-set-form/generate-set-form.component';
import {
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatCardModule,
  MatDividerModule,
  MatStepperModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CardComponent } from './card/card.component';
import { CardListComponent } from './card-list/card-list.component';
import { GenerateSetResultComponent } from './generate-set-result/generate-set-result.component';

@NgModule({
  declarations: [
    AppBarComponent,
    GenerateSetFormComponent,
    CardComponent,
    CardListComponent,
    GenerateSetResultComponent,
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
