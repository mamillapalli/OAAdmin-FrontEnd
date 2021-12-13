interface rm {
  rmId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  joiningDate: string | any;
  //validDate: string | any;
  expiryDate: string;
  status : string;
  customers: []
}

const inits: rm = {
  rmId: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  joiningDate: '',
  //validDate: '',
  expiryDate: '',
  status : '',
  customers: []
};

export { rm, inits };
