import {corporates} from "./corporates";

interface rm {
  rmId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  joiningDate: Date
  effectiveDate: Date
  expiryDate: Date;
  customers: [corporates]
  status: Boolean
}

const inits: rm = {
  rmId: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  joiningDate: new Date(),
  effectiveDate: new Date(),
  expiryDate: new Date(),
  customers: {} as [corporates],
  status: true
};

export { rm, inits };
