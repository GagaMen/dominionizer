import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AppBarComponent } from './components/app-bar/app-bar.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { CardComponent } from './components/card/card.component';
import { CardListComponent } from './components/card-list/card-list.component';
import { SetComponent } from './components/set/set.component';
import { ExpansionSelectComponent } from './components/expansion-select/expansion-select.component';
import { SpecialCardSelectComponent } from './components/special-card-select/special-card-select.component';
import { GroupingAndSortingMenuComponent } from './components/grouping-and-sorting-menu/grouping-and-sorting-menu.component';

@NgModule({
    declarations: [
        AppComponent,
        AppBarComponent,
        ConfigurationComponent,
        CardComponent,
        CardListComponent,
        SetComponent,
        ExpansionSelectComponent,
        SpecialCardSelectComponent,
        GroupingAndSortingMenuComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CommonModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatCardModule,
        MatDividerModule,
        MatStepperModule,
        MatCheckboxModule,
        MatRadioModule,
        FormsModule,
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
