export class ccorporateUser {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: Date;
  expiryDate: Date;
  status: boolean;
  emailAddress : string;
  roles: [];
  customers: [];

  constructor(d:any) {

    this.userId =  d.userId;
    this.firstName= d.firstName;
    this.lastName= d.lastName;
    this.effectiveDate= new Date(d.effectiveDate);
    this.expiryDate= new Date(d.expiryDate);
    this.status = d.status;
    this.emailAddress = d.emailAddress;
    this.roles = d.roles;
    this.customers = d.customers

  }

}
