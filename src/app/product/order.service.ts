
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../auth/token.service';
import {  Observable, Subject, catchError, map, throwError } from 'rxjs';
const baseUrl = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
 
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
   
    insertOrder(payload : any) : Observable<any> {
      return this.request('post', `${baseUrl}/orders`, payload);
    }

    insertOrderDetail(payload : any): Observable<any>{
        return this.request('post', `${baseUrl}/orderdetails`, payload);
    }
 
}