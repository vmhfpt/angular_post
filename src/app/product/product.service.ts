import { ProductAttributes } from './product.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../auth/token.service';
import {  Observable, Subject, catchError, map, throwError } from 'rxjs';
const baseUrl = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
 
  private updateList = new Subject<void>();



    constructor(private http: HttpClient, private tokenService: TokenStorageService) {
    }


    updateListClicked() {
      this.updateList.next();
    }
  
    updateListObservable() {
      return this.updateList.asObservable();
    }




    private request(method: string, url: string, data?: any, responseType?: any) {
      const token = this.tokenService.getRefreshToken();
  
     
      return this.http.request(method, url, {
        body: data,
        responseType: responseType || 'json',
        observe: 'body',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
    }

    index(){
      return this.request('get', `${baseUrl}/products`);
    }
 
    
    getOne(id : string) :  Observable<any>{
      return this.request('get', `${baseUrl}/products/${id}`).pipe(
        map((res: any) => {
          return res || {};
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
    }
    getDetail(id : string) : Observable<any>{
      
      return this.request('get', `${baseUrl}/products/detail/${id}`).pipe(
        map((res: any) => {
          return res || {};
        }),
        catchError((err) => {
          return throwError(err);
        })
      );
    }
  
   filter(query : string){
    return this.request('get', `${baseUrl}/products/filter${query}`);
   }
   getProductSuggest(category_id : string){
    return this.request('get', `${baseUrl}/products/product-suggest?category_id=${category_id}`);
   }
   addComment(payload : any): Observable<any> {
    return this.request('post', `${baseUrl}/comments`, payload);
   }

   getCommentsByProductId(productId : string){
    return this.request('get', `${baseUrl}/comments/product?product_id=${productId}`);
   }

   getHome(){
    return this.request('get', `${baseUrl}/products/home`);
   }
}