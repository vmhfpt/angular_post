import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { ProductAttributes } from '../product/product.interface';
import { Store } from '@ngrx/store';
import { CartsActions } from '../state/cart.actions';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit{
  public arrCartPopup  : any = [];
   public dataMilk : ProductAttributes[] = [];
   public dataChocolate : ProductAttributes[] = [];
   public dataCake : ProductAttributes[] = [];
   constructor(private store: Store, private  productService : ProductService){}
   ngOnInit(): void {
       this.productService.getHome().subscribe((data : any) => {
        
         this.dataMilk = data.dataFirst;
         this.dataChocolate = data.dataSecond;
         this.dataCake = data.dataThird;
       })
   }
   public formatVNDCurrency(price : Number){
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price as any);
  }
  public formatSale(price: number, price_sale : number){
    return Math.ceil(100 - ((price_sale * 100) / price ));
  }
  slideConfig = {
    slidesToShow: 1, 
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    dots: true
  };
  slideConfigAgency = {
    slidesToShow: 5, 
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    dots: false
  };
  
  public addToCart(name : string, price : number, image : string, id : string){

    let cart = {
      name,
      price,
      image,
      id,
      quantity : 1,
    };
    this.store.dispatch(CartsActions.addCart({ cart }));

    this.arrCartPopup = [...this.arrCartPopup, cart];
    if(this.arrCartPopup.length == 1){
        this.deleteCart();
    }
  }
  deleteCart() {
      const that = this;
      setTimeout(function(){
            const arr = that.arrCartPopup;
            arr.shift();
            that.arrCartPopup = arr;
          if(arr[0] !== undefined){
              that.deleteCart();
          }
      }, 2000);
  }
}
