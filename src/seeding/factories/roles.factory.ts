import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Role } from "../../entities/Role";

export const RolesFactory = setSeederFactory(Role, (faker: Faker) => {
  const role = new Role();
  role.name = faker.lorem.word();
  role.right = "USER"
  return role;
});