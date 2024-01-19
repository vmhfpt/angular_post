import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cart } from '../../cart/cart.interface';
import { HelperService } from '../helper.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  
})
export class ModalComponent  {
  constructor(public helperService : HelperService){}
  @Input() dataUser  = {
    name : '',
    email : '',
    address : '',
    createdAt : '',
    note : '',
    phone_number : '',
    total : ''
  };
  @Input() carts : Cart[]  = [];
  @Output() onClose = new EventEmitter<any>();
  
  public onClosePopup() {
    this.onClose.emit();
  }
}
