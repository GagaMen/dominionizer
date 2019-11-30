import { ConfigurationGuard } from './core/guards/configuration.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './core/configuration/configuration.component';
import { GenerateSetResultComponent } from './core/generate-set-result/generate-set-result.component';

const routes: Routes = [
  {path: '', component: ConfigurationComponent},
  {path: 'result', component: GenerateSetResultComponent, canActivate: [ConfigurationGuard] },
  // TODO: Redirect to PageNotFoundComponent when existent
  {path: '**', component: ConfigurationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
