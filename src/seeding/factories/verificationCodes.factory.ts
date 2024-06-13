import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { VerificationCode } from "../../entities/VerificationCode.entity";

export const VerificationCodesFactory = setSeederFactory(VerificationCode, (faker: Faker) => {
  const verificationCode = new VerificationCode();
  verificationCode.type = faker.lorem.word();
  // ...
  return verificationCode;
});