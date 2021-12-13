interface bankuser {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string | any;
  expiryDate: string | any;
  status: string;
  emailAddress : string;
  roles: [];
}

const inits: bankuser = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: '',
  emailAddress : '',
  roles: []
};

export { bankuser, inits };
