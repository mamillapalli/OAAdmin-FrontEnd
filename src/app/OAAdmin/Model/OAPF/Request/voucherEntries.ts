interface voucherEntries {
  "accountNumber": string
  "accountCurrency": string
  "amount": number
  "accountDescription": string
  "debitCreditFlag": string
  "exchangeRate": number
  "narrative": string
}

const inits: voucherEntries = {
  "accountNumber": "",
  "accountCurrency": "",
  "amount": 0.00,
  "accountDescription": "",
  "debitCreditFlag": "",
  "exchangeRate": 0.00,
  "narrative": ""
}

export { voucherEntries, inits };
