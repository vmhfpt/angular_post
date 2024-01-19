import {  createFeatureSelector } from '@ngrx/store';
import { Cart } from '../cart/cart.interface';

export const selectCarts = createFeatureSelector<ReadonlyArray<Cart>>('carts');

