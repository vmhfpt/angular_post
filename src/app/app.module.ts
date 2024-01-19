import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

import { HttpClientModule } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ProductModule } from './product/product.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { cartsReducer } from './state/cart.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['carts'], rehydrate: true})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
   
    HttpClientModule,
    BrowserModule,
    AuthModule,
    SlickCarouselModule,
    ProductModule,
    
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ carts: cartsReducer }, {metaReducers}),
    StoreDevtoolsModule.instrument(),

    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
