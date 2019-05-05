import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateSetFormComponent } from './core/generate-set-form/generate-set-form.component';

const routes: Routes = [
  {path: '', component: GenerateSetFormComponent},
  // TODO: Redirect to PageNotFoundComponent when existent
  {path: '**', component: GenerateSetFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
