import {corporates} from "../Request/corporates";


export class cbankuser {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string | any;
  expiryDate: string | any;
  status: boolean;
  emailAddress : string;
  roles: [];
  customers: [corporates]

  constructor(d:any) {
    this.userId =  d.userId;
    this.firstName = d.firstName;
    this.lastName = d.lastName;
    this.effectiveDate = d.effectiveDate
    this.expiryDate = d.expiryDate
    this.status = d.status;
    this.emailAddress =  d.emailAddress;
    this.roles = d.roles;
    this.customers = d.customers
  }
}


