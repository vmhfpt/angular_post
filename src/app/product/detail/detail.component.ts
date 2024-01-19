import { Component, ElementRef, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductAttributes } from '../product.interface';
import { HelperService } from '../../helper/helper.service';
import { CartService } from '../../cart/cart.service';
import { Store } from '@ngrx/store';
import { CartsActions } from '../../state/cart.actions';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  public quantity = 1;
  public arrCartPopup  : any = [];
  public showTab : boolean = true;
  public productsSuggest : ProductAttributes[] = [];
  public dataItem : ProductAttributes = {
    _id : '',
    category_id: { name : '', _id : ''},
    content: '',
    description : '',
    image : '',
    name : '',
    price : 0,
    price_sale : 0,
  }
  constructor(private store: Store, public cartService : CartService, public helperService : HelperService, private el: ElementRef , private productService : ProductService,private categoryService : CategoryService, private route: ActivatedRoute, public router: Router){}
  ngOnInit(): void {
    this.route.params.subscribe(params => { 
      this.showTab = true;
      this.productService.getDetail(params['id']).subscribe((data : ProductAttributes) => {
         this.dataItem = data;
         this.scrollToElement();
         this.getProductSuggest(data.category_id._id);
      })
    });
  }
  increase(){
    if(this.quantity != 5){
      this.quantity = this.quantity + 1;
    }
  }
  decrease(){
    if(this.quantity != 1){
      this.quantity = this.quantity - 1;
    }
    
  }

  getProductSuggest(category_id : string){
    this.productService.getProductSuggest(category_id).subscribe((data : any) => {
      this.productsSuggest = data;
   })
  }
  scrollToElement() {
    const targetElement = this.el.nativeElement.querySelector('.scroll-target');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
  public handleShowTab(action : boolean){
    this.showTab = action;
  }


    
  public addToCart(name : string, price : number, image : string, id : string){
    const cart = {
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
  public deleteCart() {
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

  handleAddCartSingle = () => {
    const cart = {
      name : this.dataItem.name,
      price : this.dataItem.price,
      image : this.dataItem.image,
      id : this.dataItem._id,
      quantity : this.quantity
    };
    this.store.dispatch(CartsActions.addCart({ cart }));
    this.router.navigate(['/cart'])
   }
}
