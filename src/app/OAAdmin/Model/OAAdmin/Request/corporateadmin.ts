import {corporates} from "./corporates";

interface corporateadmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: boolean;
  emailAddress : string;
  roles: [];
  customers: [corporates];
}

const inits: corporateadmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: true,
  emailAddress : '',
  roles: [],
  customers: {} as [corporates]
};

export { corporateadmin, inits };
