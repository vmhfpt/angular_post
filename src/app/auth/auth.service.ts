import { Injectable, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders ,HttpErrorResponse} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, delay, map, switchMap } from 'rxjs/operators';
import { TokenStorageService } from './token.service';
import { jwtDecode } from "jwt-decode";
import { catchError } from 'rxjs/operators';

const AUTH_API = 'http://localhost:5000';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({
  providedIn: 'root',
})
export class AuthService{
  isLoggedIn = false;
  constructor(private http: HttpClient, private tokenStorage: TokenStorageService) { 
    if(this.tokenStorage.getToken()){
      this.isLoggedIn = true;
    }else {
      this.isLoggedIn = false;
    }

  }
  

  // store the URL so we can redirect after logging in
  redirectUrl: string | null = null;


  refreshToken(token: string) : Observable<any> {

     return this.http.post(AUTH_API + '/auth/refresh-token', {
       refresh_token: token
     }, httpOptions)
  }

  login(email : string, password : string): Observable<boolean> {
   
    return this.http.post(AUTH_API + '/auth/login', {email : email ,  password : password})
      .pipe(
        map((response : any) => {
         if(response.status == 'success'){
            this.tokenStorage.saveToken(response.access_token);
            this.tokenStorage.saveRefreshToken(response.refresh_token);
            const decoded : any = jwtDecode(response.access_token);
            const data = {
              ...decoded.data,
              refresh_token : response.refresh_token,
              access_token : response.access_token
            }
            this.tokenStorage.saveUser(data);
            this.isLoggedIn = true;
            
           return true;

         }
         
         this.isLoggedIn = false;
         return false;
        })
      );
   
  }

  logout(): void {
    this.isLoggedIn = false;
  }
}