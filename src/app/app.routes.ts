import { HomeComponent } from './components/home/home.component';
import { configurationGuard } from './guards/configuration.guard';
import { Routes } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { SetComponent } from './components/set/set.component';

export const routes: Routes = [
    { path: 'configuration', component: ConfigurationComponent },
    { path: 'set', component: SetComponent, canActivate: [configurationGuard] },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
