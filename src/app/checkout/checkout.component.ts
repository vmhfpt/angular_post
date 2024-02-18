import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../product/order.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCarts } from '../state/cart.selectors';
import { Cart } from '../cart/cart.interface';
import { CartsActions } from '../state/cart.actions';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit{
  
  public dataItem : Cart[]  = [];
  public dataCities : any = [];
  public dataDistricts : any = [];
  public dataWards : any = [];
  public addForm: FormGroup | any;
  public dataUser : any = false;
  public cartTemp : Cart[] = [];
  constructor(private store: Store, public orderService : OrderService, public helperService : HelperService, private http: HttpClient, private fb: FormBuilder,){}

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      phone_number: ['', [Validators.required, this.validateNumericLength(/^(0[1-9]|84[1-9])(\d{8,9})$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(140)]],
      note: ['', []],
      city: ['', [Validators.required]],
      district: ['', [Validators.required]],
      ward: ['', [Validators.required]],
    });



    this.store.select(selectCarts).subscribe((data : Cart[] | any) => {
      this.dataItem = data;
    })


    this.http.get('https://vapi.vnappmob.com/api/province').subscribe((data : any) => {
      //
      //https://provinces.open-api.vn/api/
      
      this.dataCities = data.results;
    })
  }

  public closePopup(){
    this.dataUser = false;
  }
  validateNumericLength(pattern : RegExp) : ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = pattern.test(control.value);
      
      return isValid ? null : { 'vietnamesePhoneNumber': { value: control.value } };
    };
  }

  
  public onChangeCity(e : any) {
    this.dataDistricts = [];
    this.dataWards = [];

    this.addForm.patchValue({
      district : '',
      ward : ''
    });
    if(e.target.value != ''){
      let [id] = e.target.value.split('-');
      this.http.get(`https://vapi.vnappmob.com/api/province/district/${id}`).subscribe((data : any) => {
        //https://provinces.open-api.vn/api/p/${id}/?depth=2
        //
        this.dataDistricts = data.results;
      })
    }
  }
  public onChangeDistrict(e : any){
    this.dataWards = [];
    this.addForm.patchValue({
      ward : ''
    });
    let [id] = e.target.value.split('-');
    this.http.get(`https://vapi.vnappmob.com/api/province/ward/${id}`).subscribe((data : any) => {
      //https://provinces.open-api.vn/api/d/${id}/?depth=2
       this.dataWards = data.results;
    })
  }
  public getSubTotalCart() : string{
    let total =  0;
    for(let item of this.dataItem){
      total = total + (item.price * item.quantity);
    }
    return this.helperService.formatVNDCurrency(total);
 }
  public onSubmit(){

    if (this.addForm.valid) {
      var currentdate = new Date(); 
      var datetime = currentdate.getFullYear() + "-"
              + (currentdate.getMonth()+1)  + "-" 
              + currentdate.getDate() + " "  
              + currentdate.getHours() + ":"  
              + currentdate.getMinutes() + ":" 
              + currentdate.getSeconds();

      const [a, city] = this.addForm.value.city.split('-');
      const [b, district] = this.addForm.value.district.split('-');
      const [c, ward] = this.addForm.value.ward.split('-');
      let payload = {
        ...this.addForm.value,
        status : 6,
        createdAt : datetime,
        address : `${this.addForm.value.address}, ${ward}, ${district}, ${city}`,
      } 
      delete payload.city;
      delete payload.ward;
      delete payload.district;
      
      this.orderService.insertOrder(payload).subscribe(
        (data : any) => {
          
        
          for(const [i, item] of this.dataItem.entries()){
             this.orderService.insertOrderDetail({
              order_id : data._id,
              price : item.price,
              product_id : item.id,
              quantity : item.quantity
             }).subscribe((dataOrderDetail : any) => {
                if(i == this.dataItem.length - 1){
                  const carts : Cart[] = [];
                  this.dataUser = {
                    ...payload,
                    total : this.getSubTotalCart()
                  };
                  this.cartTemp = this.dataItem;
                  this.store.dispatch(CartsActions.retrievedCartList({ carts }));
                }
             });
          }
        }
      )
      
    }
    
  }
  
}
