import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodeSnippetsPage } from './code-snippets.page';

const routes: Routes = [
  {
    path: '',
    component: CodeSnippetsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodeSnippetsPageRoutingModule {}
