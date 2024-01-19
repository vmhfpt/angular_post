import { Cart } from "../cart/cart.interface";
import { createReducer, on } from '@ngrx/store';
import { CartsActions } from "./cart.actions";

export const initialState: ReadonlyArray<Cart> = [];

export const checkArrayCart = (arr : Cart[], id : string) => {
    for(var i = 0; i < arr.length; i ++){
        if(arr[i].id == id){
          return(true);
        }
    }
    return (false);
}

export const cartsReducer = createReducer(
    initialState,
    on(CartsActions.retrievedCartList, (state, { carts }) => {
      return carts;
    }),
    on(CartsActions.addCart, (state : Cart[] | any, { cart  }) => {
        
        if(checkArrayCart(state, cart.id) == true){
            
            var newArr = state.map((value : Cart) => {
                if(value.id == cart.id){
                    return {
                    ...value,
                    quantity : (Number((value.quantity)) + cart.quantity)
                    }
                }else {
                    return (value);
                }
            });
            return newArr;
        }else {
            return [...state, cart];
        }
    }),
    on(CartsActions.removeCart, (state, { cartId  }) =>
      state.filter((item) => item.id !== cartId)
    ),
    on(CartsActions.editCart, (state : Cart[] | any, { cart  }) => {
        if(cart.quantity <= 0 || cart.quantity >= 6) return state;
        return state.map((item : Cart) => {
            if(item.id == cart.id){
                return {
                  ...item,
                  quantity : cart.quantity
                };
            }else {
                return item;
            }
        })
    }
    ),
  );