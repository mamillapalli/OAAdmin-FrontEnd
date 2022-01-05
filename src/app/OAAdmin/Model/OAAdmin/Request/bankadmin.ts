interface BankAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  emailAddress : string;
  roles: []
}

const inits: BankAdmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  emailAddress : '',
  roles: []
};

export { BankAdmin, inits };
