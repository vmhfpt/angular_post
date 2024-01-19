import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { CategoryAttributes } from '../../product/category.interface';
import { CategoryService } from '../../product/category.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { Cart } from '../../cart/cart.interface';
import { Store } from '@ngrx/store';
import { selectCarts } from '../../state/cart.selectors';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit{
  public categories : CategoryAttributes[] = [];
  public searchForm: FormGroup | any;
  public dataItem : number = 0;
  constructor(private store: Store, private cartService : CartService, private categoryService : CategoryService, private fb: FormBuilder, public router: Router){

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
  ngOnInit(): void {
      this.searchForm = this.fb.group({
        key: ['', []],
      });
      this.categoryService.index().subscribe((data : any) => {
         this.categories = this.convertData(data);
         
      })

      this.store.select(selectCarts).subscribe((data : Cart[] | any) => {
        this.dataItem = this.cartService.getTotalCart(data);
      })
  }
  onSubmit(){
    const url = '/product' +  '?_key=' + this.searchForm.value.key
    this.router.navigateByUrl(url);
  }
}
