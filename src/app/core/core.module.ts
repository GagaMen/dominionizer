import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { AppBarComponent } from './app-bar/app-bar.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CardComponent } from './card/card.component';
import { CardListComponent } from './card-list/card-list.component';
import { GenerateSetResultComponent } from './generate-set-result/generate-set-result.component';

@NgModule({
  declarations: [
    AppBarComponent,
    ConfigurationComponent,
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
    MatSliderModule,
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
