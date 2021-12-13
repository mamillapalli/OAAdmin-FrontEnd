interface Corporateuser {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string | any;
  expiryDate: string | any;
  status: string;
  emailAddress : string;
  roles: [];
  customers: [];
}

const inits: Corporateuser = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: '',
  emailAddress : '',
  roles: [],
  customers: []
};

export { Corporateuser, inits };
