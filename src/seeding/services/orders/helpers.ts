import { Stock } from "../../../entities/Stock.entity"

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getRandomDateWithinRange(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime()
  const end = endDate.getTime()
  const randomTime = new Date(start + Math.random() * (end - start))
  return randomTime
}

export function generateRandomDateTimeRange(): {
  dateTimeStart: Date
  dateTimeEnd: Date
} {
  const now = new Date()
  const twoMonthsFromNow = new Date()
  twoMonthsFromNow.setMonth(now.getMonth() + 2)

  // Generate random dateTimeStart within the next 2 months
  const dateTimeStart = getRandomDateWithinRange(now, twoMonthsFromNow)

  // Generate random dateTimeEnd between 1 and 30 days after dateTimeStart
  const dateTimeEnd = new Date(dateTimeStart)
  dateTimeEnd.setDate(dateTimeEnd.getDate() + getRandomInt(1, 30))

  return { dateTimeStart, dateTimeEnd }
}

export function calculateAvailableStocksForProduct(
  stocks: Stock[],
  dateTimeStart: Date,
  dateTimeEnd: Date
): number {
  let availableStockCount = 0
  for (const stock of stocks) {
    let isAvailable = true

    for (const orderStock of stock.orderStocks) {
      if (
        !(
          dateTimeEnd <= orderStock.dateTimeStart ||
          dateTimeStart >= orderStock.dateTimeEnd
        )
      ) {
        isAvailable = false
        break
      }
    }

    if (isAvailable) {
      availableStockCount++
    }
  }

  return availableStockCount
}
