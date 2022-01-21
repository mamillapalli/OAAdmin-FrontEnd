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
}

const inits: rm = {
  rmId: '',
  firstName: '',
  lastName: '',
  emailAddress: '',
  joiningDate: new Date(),
  effectiveDate: new Date(),
  expiryDate: new Date(),
  customers: {} as [corporates]
};

export { rm, inits };
