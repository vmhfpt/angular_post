import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html'
})
export class CommentComponent implements AfterViewInit, OnInit{
  public addForm: FormGroup | any;
  public dataItem : any = [];
  @Input() product_id = "";
  @Input() nameProduct = '';
  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private productService : ProductService,
  ) {}
  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      content: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(140)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngAfterViewInit(): void {
      //console.log(this.product_id);
      this.showComments();
  }

  onSubmit(){
    var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    let createdAt = datetime;
    if (this.addForm.valid) {
     
      const payload = {
        ...this.addForm.value,
        product_id : this.product_id,
        createdAt : createdAt
      }
      this.productService.addComment(payload).subscribe(
        (res : any) => {
          this.addForm.setValue({
            name: '',
            content : '',
            email : '',
          });
          this.showComments();
        }
      )
      
    }
    
  }

  public showComments(){
     this.productService.getCommentsByProductId(this.product_id).subscribe(
      (data : any) => {
        this.dataItem = data;
        this.scrollToElement();
      }
     )
  }

  scrollToElement() {
    const targetElement = this.el.nativeElement.querySelector('.show-comments');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
