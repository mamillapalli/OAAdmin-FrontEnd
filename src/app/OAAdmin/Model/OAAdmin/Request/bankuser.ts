import {corporates} from "./corporates";


interface bankuser {
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

const inits: bankuser = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: false,
  emailAddress : '',
  roles: [],
  customers: {} as [corporates]
};

export { bankuser, inits };
