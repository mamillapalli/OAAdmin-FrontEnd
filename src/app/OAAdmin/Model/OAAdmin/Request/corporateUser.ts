interface corporateUser {
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

const inits: corporateUser = {
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

export { corporateUser, inits };
