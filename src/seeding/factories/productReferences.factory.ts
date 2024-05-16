import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { ProductReference } from "../../entities/ProductReference.entity";

export const ProductReferencesFactory = setSeederFactory(ProductReference, (faker: Faker) => {
  const productReference = new ProductReference();
  productReference.description = faker.commerce.productDescription();
  productReference.index = 1;
  productReference.display = true;
  productReference.price = Math.floor(Math.random() * 10 * 100);
  productReference.createdAt = faker.date.recent();
  productReference.updatedAt = faker.date.recent();  
  productReference.name = `dafault name ${faker.number.int({min: 1, max: 100000})}`;
  productReference.brandName = `dafault brand name ${faker.number.int({min: 1, max: 100000})}`;
  
  return productReference;
});
