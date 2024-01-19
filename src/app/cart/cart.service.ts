declare var $: any;
export class CartService {

    public getTotalCart(arr : any) : number{
      
        if(arr == null){
            return 0
        }else {
          var sum = 0;
          for(var i = 0; i < arr.length; i ++){
            sum = sum + Number(arr[i].quantity);
          }
          return sum;
        }
    }
    public addCart(item : any, redirect = false){
                        
        var shopCart = JSON.parse(localStorage.getItem("carts") as string);
        if(shopCart == null){
            localStorage.setItem("carts", JSON.stringify([item]));
        }else {
          function checkArray(arr : any, id : any){
              for(var i = 0; i < arr.length; i ++){
                if(arr[i].id == id){
                  return(true);
                }
              }
              return (false);
            }
          
            
            if(checkArray(shopCart, item.id) == true){
              var newArr = shopCart.map((value : any, key : any) => {
                    if(value.id == item.id){
                      return {
                        ...value,
                        quantity : (Number((value.quantity)) + item.quantity)
                      }
                    }else {
                        return (value);
                    }
              });
               localStorage.setItem("carts", JSON.stringify(newArr));
            }else {
                localStorage.setItem("carts", JSON.stringify([...shopCart, item]));
            }
    
        }
        this.getTotalCart(JSON.parse(localStorage.getItem("carts") as string) );
        if(redirect){
           window.location.replace("/cart");
        }
    }
}