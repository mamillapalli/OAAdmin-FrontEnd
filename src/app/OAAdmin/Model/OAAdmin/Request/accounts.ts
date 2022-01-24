import {corporates} from "./corporates";


interface Accounts {
  accountId : string
  name: string
  type: string
  description: string
  currency: string
  debitCreditFlag: string
  businessType: string
  customer: corporates
}
const inits: Accounts = {
  "accountId": "",
  "name": "",
  "type": "",
  "description": "",
  "currency": "",
  "debitCreditFlag": "",
  "businessType": "Payable Finance",
  customer: {} as corporates
}

export { Accounts, inits };
