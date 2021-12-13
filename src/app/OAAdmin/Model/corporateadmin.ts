interface Corporateadmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  emailAddress : string;
  roles: [];
  customers: [];
}

const inits: Corporateadmin = {
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

export { Corporateadmin, inits };
