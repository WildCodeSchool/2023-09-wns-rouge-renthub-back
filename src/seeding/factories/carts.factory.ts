import { setSeederFactory } from "typeorm-extension";
import { Cart } from "../../entities/Cart.entity";

export const CartsFactory = setSeederFactory(Cart, () => {
  const cart = new Cart();
  return cart;
});