import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaRecetaPage } from './nueva-receta.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaRecetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaRecetaPageRoutingModule {}
