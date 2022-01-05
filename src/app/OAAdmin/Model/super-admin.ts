interface superAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  emailAddress : string;
}

const inits: superAdmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: '',
  emailAddress : '',
};

export { superAdmin, inits };
