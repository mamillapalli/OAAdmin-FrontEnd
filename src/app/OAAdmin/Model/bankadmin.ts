interface BankAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  emailAddress : string;
  roles: []
}

const inits: BankAdmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: '',
  emailAddress : '',
  roles: []
};

export { BankAdmin, inits };
