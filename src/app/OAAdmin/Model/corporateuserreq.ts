import {Customerreq} from "./customerreq";

export class corporateuserreq{
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  emailAddress : string;
  roles: [];
  customers: [Customerreq];
}
