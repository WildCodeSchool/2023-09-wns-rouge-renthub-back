import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { ProductCart } from "../../entities/ProductCart.entity";

export const ProductCartsFactory = setSeederFactory(ProductCart, (faker: Faker) => {
  const productCart = new ProductCart();

  const startDate = faker.date.future();
  const endMaxDate = new Date(startDate);
  endMaxDate.setMonth(startDate.getMonth() + 1);

  productCart.quantity = 0;
  productCart.dateTimeStart = startDate;
  productCart.dateTimeEnd = faker.date.between({from: startDate, to: endMaxDate});

  return productCart;
});
