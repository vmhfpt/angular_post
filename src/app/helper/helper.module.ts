import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  declarations: [
    ModalComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ModalComponent,
    LoadingComponent,
    
  ],
})
export class HelperModule { }
