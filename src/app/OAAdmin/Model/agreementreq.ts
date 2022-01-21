import { Customer } from "./customer";
import { rm } from "./OAAdmin/Request/rm";

export class Agreementreq {
  contractReferenceNumber: string;
  contractDocumentNumber: string;
  remarks: string;
  transactionDate: string;
  validDate: string;
  expiryDate: string;
  limitReference : string;
  limitExpiry: string;
  limitCurrency: string;
  cashMargin: string;
  limitAmount : string;
  businessType: [];
  anchorCustomer: [Customer];
  rm: [rm];
  counterParties: [Customer];
}
