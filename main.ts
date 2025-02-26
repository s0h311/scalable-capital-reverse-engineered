import transactions from "./data.json" with {type: "json"};

const securityTransactions = transactions.filter((t) => t.type === 'SECURITY_TRANSACTION')

const buys = securityTransactions.filter((t) => t.side === 'BUY')
const sells = securityTransactions.filter((t) => t.side === 'SELL')

const buysByYear = Object.groupBy(buys, (transaction) => new Date(transaction.lastEventDateTime).getFullYear())
const sellsByYear = Object.groupBy(sells, (transaction) => new Date(transaction.lastEventDateTime).getFullYear())

for (const [year, transactionsOfYear] of Object.entries(buysByYear)) {
  
  const total = transactionsOfYear.map((t) => (t.amount * -1)).reduce((a, b) => (a) + (b), 0)

  buysByYear[year] = Math.ceil(total)
}

for (const [year, transactionsOfYear] of Object.entries(sellsByYear)) {
  
  const total = transactionsOfYear.map((t) => (t.amount)).reduce((a, b) => (a) + (b), 0)

  sellsByYear[year] = Math.ceil(total)
}

console.log(buysByYear)
console.log(sellsByYear)

const allYears = new Set([...Object.keys(buysByYear), ...Object.keys(sellsByYear)])

const netTotalByYear = {}

for (const year of allYears) {
  const buys = buysByYear[year] ?? 0
  const sells = sellsByYear[year] ?? 0

  netTotalByYear[year] = buys - sells
}

console.log(netTotalByYear)

const allAssets = new Set(transactions.filter((t) => !!t.isin).map((t) => t.isin))

console.log(allAssets)