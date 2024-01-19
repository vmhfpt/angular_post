import { Component, ElementRef, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ProductAttributes } from '../product.interface';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CategoryAttributes } from '../category.interface';
import { CategoryService } from '../category.service';
import { CartService } from '../../cart/cart.service';


import { Store } from '@ngrx/store';
import { Cart } from '../../cart/cart.interface';
import { selectCarts } from '../../state/cart.selectors';
import { CartsActions } from '../../state/cart.actions';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit{
  public filterByPrice = [
    {
      min : 0,
      max : 50000,
      text : '0 - 50.000đ'
    },
    {
      min : 50000,
      max : 100000,
      text : '50 - 100.000đ'
    },
    {
      min : 100000,
      max : 500000,
      text : '100 - 500.000đ'
    },
    {
      min : 500000,
      max : 100000000,
      text : '500 - ∞'
    }
  ];
  public paginate = {
    total_item : false,
    current_page : false,
    next_page : false,
    prev_page : false,
    total_page : false,
    more_item : false
  };
  public keySearch : string | boolean = false;
  public categoryFilter : string = '';
  public objectSort : any = {};
  public dataItem : ProductAttributes[] = [];
  public arrCartPopup  : any = [];
  public categories : CategoryAttributes[] = [];
  constructor(private store: Store, private cartService : CartService, private el: ElementRef , private productService : ProductService,private categoryService : CategoryService, private route: ActivatedRoute, public router: Router){}
  ngOnInit(): void {
      this.categoryFilter = this.route.snapshot.paramMap.get('id')!;
     
     

      this.categoryService.index().subscribe((data: any) => {
        this.categories = this.convertData(data);
      })
     
      this.route.params.subscribe(params => { 
        let url = '';
        this.categoryFilter = params['id'] ? params['id'] : '';
      
        if(window.location.search && this.categoryFilter){
           url =  window.location.search + '&category_id=' + this.categoryFilter;
        }else if(this.categoryFilter){
          url = '?category_id=' + this.categoryFilter + window.location.search;
        }
        this.handeShowData(url);
      });
        
      this.route.queryParams.subscribe(params => {
        let url = '';
        if(this.categoryFilter){
           url = this.objectToQueryString({...params, category_id : this.categoryFilter});
        }else {
           url = this.objectToQueryString(params);
        }
        
        this.handeShowData("?" + url);
      });
    

     
  }
  convertData(data : CategoryAttributes[]){
    
    let newArr : CategoryAttributes[] = [];
    data.map((item, key) => {
      
      if(item.parent_id == null){
         newArr.push({...item, lever : 0});
         data.map((i, k) => {
             if(i.parent_id != null && i.parent_id._id == item._id){
               newArr.push({...i, lever : 1});
             }
         })
      }
    })
    return newArr;
  }
  public formatVNDCurrency(price : Number){
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price as any);
  }
  public formatSale(price: number, price_sale : number){
    return Math.ceil(100 - ((price_sale * 100) / price ));
  }

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
  public filter(type : string, value : any){
    if(type == 'page'){
      this.objectSort = {
        ...this.objectSort,
        _page : Number(value)
      }
    }
    if(type == 'sort'){
   
      if(value.target.value == '1'){
        this.objectSort = {
            ...this.objectSort,
            _sort : 'price_sale',
            _order : 'asc'
        }
      }
      if(value.target.value == '2'){
        this.objectSort = {
          ...this.objectSort,
          _sort : 'price_sale',
          _order : 'desc'
        }
      }
      if(value.target.value == '3'){
        this.objectSort = {
          ...this.objectSort,
          _sort : 'name',
        }
      }
      //console.log(this.objectSort);
    }
    if(type == 'price'){
     
      this.objectSort = {
        ...this.objectSort,
        _min : value.min,
        _max : value.max
      }
    }
    if(type == 'category'){
      this.categoryFilter = value;
    }
    this.handleRedirect();
  }
  public handleRedirect(){
    let url : string = "/product/" + this.categoryFilter;
    url = url + '?' + this.objectToQueryString(this.objectSort); 
    this.router.navigateByUrl(url);

  }
  public  objectToQueryString(obj: Record<string, any>): string {
    const queryParams = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
  
        if (Array.isArray(value)) {
          for (const item of value) {
            queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(item)}`);
          }
        } else {
          queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
        }
      }
    }
    return queryParams.join('&');
  }

  parseQueryParams(queryString : string) {
    if(queryString == '' || queryString == '?') return {};
    queryString = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  
  
    const queryParamsArray = queryString.split('&');
  
    const queryParamsObject : any = {};
  
   
    queryParamsArray.forEach(param => {
      const [key, value] = param.split('=');
      queryParamsObject[key] = decodeURIComponent(value);
    });
  
    return queryParamsObject;
  }


  public handeShowData(query : string){
    
    const queryParams = this.route.snapshot.queryParamMap;

    if (queryParams.has('_key')) {
      const value : any = queryParams.get('_key');
      this.keySearch = value;
      
    } else {
      this.keySearch = false;
    }


    let obj = this.parseQueryParams(query);
    
    if(obj.category_id) {
      this.categoryFilter = obj.category_id;
      delete obj.category_id;
    }
    this.objectSort = (obj);
   
    this.productService.filter(query).subscribe((data : any) => {
      this.dataItem = data.dataItem;
      this.paginate = data.paginate;
      this.scrollToElement() ;
   });
  }

  scrollToElement() {
    const targetElement = this.el.nativeElement.querySelector('.scroll-target');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
  public getNameCategory(id : string) : string{
    const filter = this.categories;
    for(let item of filter){
       if(item._id == id){
        return item.name;
       }
    }
    return '';
  }
}


