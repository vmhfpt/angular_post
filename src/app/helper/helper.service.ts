export class HelperService {
    public formatVNDCurrency(price : Number){
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price as any);
    }
    public formatSale(price: number, price_sale : number){
        return Math.ceil(100 - ((price_sale * 100) / price ));
    }
}