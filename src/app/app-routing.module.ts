import { HomeComponent } from './components/home/home.component';
import { configurationGuard } from './guards/configuration.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { SetComponent } from './components/set/set.component';

const routes: Routes = [
    { path: 'configuration', component: ConfigurationComponent },
    { path: 'set', component: SetComponent, canActivate: [configurationGuard] },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
