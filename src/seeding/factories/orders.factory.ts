import { setSeederFactory } from "typeorm-extension";
import { Order, StatusEnum } from "../../entities/Order.entity";
// import { Faker } from "@faker-js/faker";

export const OrdersFactory = setSeederFactory(Order, () => {
  const order = new Order();
  
  order.status = StatusEnum.INPROGRESS
  return order;
});