import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Picture } from "../../entities/Picture.entity";

export const PicturesFactory = setSeederFactory(Picture, (faker: Faker) => {
  const picture = new Picture();
  picture.name = faker.word.noun({ length: { min: 5, max: 15 } })
  // ...
  return picture;
});