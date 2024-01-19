import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { CartService } from './cart.service';
import { Store } from '@ngrx/store';
import { CartsActions } from '../state/cart.actions';
import { Cart } from './cart.interface';
import { selectCarts } from '../state/cart.selectors';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit{
  public dataItem : Cart[] = [];
  
  constructor(private store: Store, private cartService : CartService, public helperService : HelperService){}
  ngOnInit(): void {
    this.store.select(selectCarts).subscribe((data : Cart[] | any) => {
        this.dataItem = data;
    })
  }

  


  public changeInputQuantity(id : string, e : any){
    const cart : Cart | any = {
        id : id,
        quantity : Number(e.target.value)
    }
    this.store.dispatch(CartsActions.editCart({ cart }));
  }

  public changeCartQuantity(quantity : number, id : string) {
      const cart : Cart | any = {
        quantity : quantity,
        id : id
      }
      this.store.dispatch(CartsActions.editCart({ cart }));
 
  }
  public getSubTotalCart() : string{
   
     let total =  0;
     for(let item of this.dataItem){
       total = total + (item.price * item.quantity);
     }
     return this.helperService.formatVNDCurrency(total);
  }
  public deleteCart(id : string){

    const cartId = id;
    this.store.dispatch(CartsActions.removeCart({ cartId }));

  }

}
