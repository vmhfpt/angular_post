import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { DetailComponent } from './detail/detail.component';
import { CartComponent } from '../cart/cart.component';
import { CheckoutComponent } from '../checkout/checkout.component';
const routes: Routes = [
  {
    path: 'product',
    component: ProductComponent,
    // children: [
    //   {
    //     path: 'add',
    //     canActivateChild: [authGuard],
    //     component: AddProductComponent
    //   },
    //   {
    //     path: ':id',
    //     canActivateChild: [authGuard],
    //     component: EditProductComponent,
    //   },
    // ]
  },
  { path : 'checkout', component: CheckoutComponent},
  { path : 'cart', component: CartComponent},
  { path : 'product/:id', component: ProductComponent},
  { path : ':id', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
