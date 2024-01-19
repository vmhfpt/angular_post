import { createActionGroup, props } from '@ngrx/store';
import { Cart } from '../cart/cart.interface';

export const CartsActions = createActionGroup({
    source: 'Carts',
    events: {
      'Retrieved Cart List': props<{ carts: ReadonlyArray<Cart> }>(),
      'Add Cart': props<{ cart: Cart }>(),
      'Remove Cart': props<{ cartId: string }>(),
      'Edit Cart': props<{ cart : Cart}>(),
    },
  });