import {corporates} from "./corporates";

interface Accounts {
  accountId : string
  name: string
  type: string
  description: string
  currency: string
  debitCreditFlag: string
  customers: [corporates]
}
const inits: Accounts = {
  "accountId": "",
  "name": "",
  "type": "",
  "description": "",
  "currency": "",
  "debitCreditFlag": "",
  customers: {} as [corporates]
}

export { Accounts, inits };
