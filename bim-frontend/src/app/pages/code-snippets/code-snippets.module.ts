import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodeSnippetsPageRoutingModule } from './code-snippets-routing.module';

import { CodeSnippetsPage } from './code-snippets.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodeSnippetsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CodeSnippetsPage]
})
export class CodeSnippetsPageModule {}
