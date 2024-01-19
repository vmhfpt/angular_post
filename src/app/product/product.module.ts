import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product/product.component';
import { DetailComponent } from './detail/detail.component';

import { HelperService } from '../helper/helper.service';
import { CommentComponent } from './comment/comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../cart/cart.service';
import { CartComponent } from '../cart/cart.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { HelperModule } from '../helper/helper.module';

@NgModule({
  declarations: [
    ProductComponent,
    DetailComponent,
    CommentComponent,
    CartComponent,
    CheckoutComponent,
    
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductRoutingModule,
    HelperModule
  ],
  providers: [
    HelperService,
    CartService
  ],
})
export class ProductModule { }
