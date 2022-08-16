import {corporates} from "../Request/corporates";
import { cbusinessType } from "./cbusinessType";

export class sendingfinacing {
  customerId: string
  constructor(d:any) {
    this.customerId = d.customerId
  }
}


export class caccounts {
  accountId : string
  name: string
  type: string
  description: string
  currency: string
  debitCreditFlag: string
  businessType: cbusinessType
  customer: sendingfinacing;
  status : boolean

  constructor(d:any) {

    this.accountId =  d.accountId
    this.name = d.name
    this.type = d.type
    this.description =  d.description
    this.currency =  d.currency
    this.debitCreditFlag = d.debitCreditFlag
    this.businessType = new cbusinessType(d.businessType)
    this.customer = new sendingfinacing(d.customer)
    this.status = true;
  }
}
