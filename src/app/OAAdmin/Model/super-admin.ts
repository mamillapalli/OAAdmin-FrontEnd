interface superAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: boolean;
  emailAddress : string;
}

const inits: superAdmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: true,
  emailAddress : '',
};

export { superAdmin, inits };
