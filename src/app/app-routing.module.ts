import { ConfigurationGuard } from './core/guards/configuration.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateSetFormComponent } from './core/generate-set-form/generate-set-form.component';
import { GenerateSetResultComponent } from './core/generate-set-result/generate-set-result.component';

const routes: Routes = [
  {path: '', component: GenerateSetFormComponent},
  {path: 'result', component: GenerateSetResultComponent, canActivate: [ConfigurationGuard] },
  // TODO: Redirect to PageNotFoundComponent when existent
  {path: '**', component: GenerateSetFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
