interface ICreateAccount {
  customerId: string;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  poBox: string;
  country: string;
  emailAddress: string;
  vatRegistrationNumber: string;
  taxRegistrationNumber: string;
  directorName: string;
  directorDetails: string;
  sponsorName: string;
  sponsorDetails: string;
  status: string;
  mode: string;
}

const inits: ICreateAccount = {
  customerId: '',
  name: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  poBox: '',
  country: '',
  emailAddress: '',
  vatRegistrationNumber: '',
  taxRegistrationNumber: '',
  directorName: '',
  directorDetails: '',
  sponsorName: '',
  sponsorDetails: '',
  status: '',
  mode: ''
};

export { ICreateAccount, inits };
