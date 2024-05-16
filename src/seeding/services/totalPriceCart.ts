import { ProductCart } from "../../entities/ProductCart.entity";

export default function totalPriceCart(productCartsSaved: ProductCart[]) {

  let totalPrice = 0;
  productCartsSaved.forEach((productCart) => {
    totalPrice += productCart.quantity * productCart.productReference.price;
  });

}