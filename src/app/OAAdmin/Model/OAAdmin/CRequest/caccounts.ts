import {corporates} from "../Request/corporates";

export class caccounts {
  accountId : string
  name: string
  type: string
  description: string
  currency: string
  debitCreditFlag: string
  customer: [corporates]
  constructor(d:any) {
    this.accountId =  d.accountId
    this.name = d.name
    this.type = d.type
    this.description =  d.description
    this.currency =  d.currency
    this.debitCreditFlag = d.debitCreditFlag
    this.customer = [d.corporates]
  }
}
