import {corporates} from "../Request/corporates";

export class crm {
  rmId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  joiningDate: Date
  effectiveDate: Date
  expiryDate: Date;
  customers: [corporates]
}
