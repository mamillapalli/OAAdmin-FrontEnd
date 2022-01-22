interface corporates {
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
  status: boolean;
  bank: boolean;
  nonCustomer: boolean;
  effectiveDate: Date;
  expiryDate: Date;
}

const inits: corporates = {
  customerId: '',
  name:  '',
  addressLine1:  '',
  addressLine2:  '',
  addressLine3:  '',
  poBox:  '',
  country:  '',
  emailAddress:  '',
  vatRegistrationNumber:  '',
  taxRegistrationNumber:  '',
  directorName:  '',
  directorDetails:  '',
  sponsorName:  '',
  sponsorDetails:  '',
  status:  true,
  bank: false,
  nonCustomer: false,
  effectiveDate: new Date,
  expiryDate: new Date,
}

export { corporates, inits };
