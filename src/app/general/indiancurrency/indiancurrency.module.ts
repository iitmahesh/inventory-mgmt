import { IndiancurrencyPipe } from './indiancurrency.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [IndiancurrencyPipe],
  imports: [
    CommonModule
  ],
  exports: [
    IndiancurrencyPipe
  ]
})
export class IndiancurrencyModule { }
