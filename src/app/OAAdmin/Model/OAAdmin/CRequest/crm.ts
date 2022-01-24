import {corporates} from "../Request/corporates";

export class crm {
  rmId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  joiningDate: Date
  effectiveDate: Date
  expiryDate: Date;
  customers: corporates

  constructor(d:any) {
    this.rmId =  d.rmId;
    this.firstName=  d.firstName;;
    this.lastName=  d.lastName;;
    this.emailAddress=  d.emailAddress;;
    this.joiningDate=  new Date(d.joiningDate);
    this.effectiveDate=  new Date(d.effectiveDate);
    this.expiryDate=  new Date(d.expiryDate);
    this.customers=  d.customers
  }

}
