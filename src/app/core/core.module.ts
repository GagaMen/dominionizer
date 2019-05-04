import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FormGenerateSetComponent } from './form-generate-set/form-generate-set.component';
import { MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatSlideToggleModule, MatCardModule, MatDividerModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FormGenerateSetComponent,
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
    CoreRoutingModule
  ]
})
export class CoreModule { }
