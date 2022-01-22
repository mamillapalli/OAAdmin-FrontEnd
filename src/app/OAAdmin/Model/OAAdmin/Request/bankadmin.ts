interface BankAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  emailAddress : string;
  roles: [],
  status : boolean
}

const inits: BankAdmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  emailAddress : '',
  roles: [],
  status : true
};

export { BankAdmin, inits };
