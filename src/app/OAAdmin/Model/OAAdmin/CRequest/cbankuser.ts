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
}
