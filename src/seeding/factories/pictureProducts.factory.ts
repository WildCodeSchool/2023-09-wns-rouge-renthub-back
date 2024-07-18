import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { PictureProduct } from "../../entities/PictureProduct.entity";

export const PictureProductsFactory = setSeederFactory(PictureProduct, (faker: Faker) => {
  const pictureProduct = new PictureProduct();
  pictureProduct.index = faker.number.int({ min: 1, max: 10 });
  // ...
  return pictureProduct;
});