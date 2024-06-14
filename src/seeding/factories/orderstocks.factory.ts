import { setSeederFactory } from "typeorm-extension";
import { OrderStock } from "../../entities/OrderStock.entity";
import { Faker } from "@faker-js/faker";

export const OrdersStocksFactory = setSeederFactory(OrderStock, (faker: Faker) => {
  const orderStock = new OrderStock();
  
  const startDate = faker.date.future();
  const endMaxDate = new Date(startDate);
  endMaxDate.setMonth(startDate.getMonth() + 1);

  orderStock.dateTimeStart = startDate;
  orderStock.dateTimeEnd = faker.date.between({from: startDate, to: endMaxDate});

  return orderStock;
});