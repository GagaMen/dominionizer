import { HomeComponent } from './components/home/home.component';
import { ConfigurationGuard } from './guards/configuration.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { SetComponent } from './components/set/set.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'configuration', component: ConfigurationComponent },
    { path: 'set', component: SetComponent, canActivate: [ConfigurationGuard] },
    // TODO: Redirect to PageNotFoundComponent when existent
    { path: '**', component: ConfigurationComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
