import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from './token.service';
import { AuthService } from './auth.service';


import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, private tokenService: TokenStorageService, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.tokenService.getToken();
    
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }else {
     // this.router.navigate(['/login']); 
    }

    return next.handle(authReq).pipe(catchError(error => {
     
      if(error.error && error.error.message == 'refresh_token error' && error.status === 401){
        return throwError('refresh_token error');
      }
      if (error instanceof HttpErrorResponse && error.status === 401) {
        
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
   
    if (!this.isRefreshing) {
     
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();

      if (token){
      
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            
            this.isRefreshing = false;

            this.tokenService.saveToken(token.access_token);
            this.tokenService.saveRefreshToken(token.refresh_token);
            this.refreshTokenSubject.next(token.access_token);
             
             return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((err) => {
            
           
            this.isRefreshing = false;
            
            this.tokenService.signOut();
            this.router.navigate(['/login']); 
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
     return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }

}


