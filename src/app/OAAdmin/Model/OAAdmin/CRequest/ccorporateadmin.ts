import {corporates} from "../Request/corporates";

export class ccorporateadmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  emailAddress : string;
  roles: [];
  customers: [corporates];
}
