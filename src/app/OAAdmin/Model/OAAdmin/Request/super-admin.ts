interface superAdmin {
  userId: string;
  firstName: string;
  lastName: string;
  effectiveDate: string;
  expiryDate: string;
  status: boolean;
  emailAddress : string;
  accountType:string
}

const inits: superAdmin = {
  userId: '',
  firstName: '',
  lastName: '',
  effectiveDate: '',
  expiryDate: '',
  status: true,
  emailAddress : '',
  accountType:''
};

export { superAdmin, inits };
