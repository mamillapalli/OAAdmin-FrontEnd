import { Customer } from "./customer";
import { rm } from "./OAAdmin/Request/rm";

interface Agreement {
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
  limitAllocatedAmount: string;
  limitUnallocatedAmount: string;
  cableChargeCurrency: string;
  cableChargeAmount: string;
  communicationChargeCurrency: string;
  communicationChargeAmount: string;
  anchorPartyApprovalRequired: string;
  counterPartyApprovalRequired: string;
  autoFinance: string;
  autoSettlement: string;
  financeServiceChargeCurrency: string;
  financeServiceChargeAmount: string;
  settlementServiceChargeCurrency: string;
  settlementServiceChargeAmount: string;
  invoiceServiceChargeCurrency: string;
  invoiceServiceChargeAmount: string;
  businessType: [string];
  anchorCustomer: [Customer];
  rm: [rm];
  counterParties: [Customer];
}

const inits: Agreement = {
  contractReferenceNumber: '',
  contractDocumentNumber: '',
  remarks: '',
  transactionDate: '',
  expiryDate: '',
  validDate: '',
  limitReference : '',
  limitExpiry: '',
  limitCurrency: '',
  cashMargin: '',
  limitAmount:'',
  limitAllocatedAmount: '',
limitUnallocatedAmount: '',
cableChargeCurrency: '',
cableChargeAmount: '',
communicationChargeCurrency: '',
communicationChargeAmount: '',
anchorPartyApprovalRequired: '',
counterPartyApprovalRequired: '',
autoFinance: '',
autoSettlement: '',
financeServiceChargeCurrency: '',
financeServiceChargeAmount: '',
settlementServiceChargeCurrency: '',
settlementServiceChargeAmount: '',
invoiceServiceChargeCurrency: '',
invoiceServiceChargeAmount: '',
  businessType: [{} as string],
  anchorCustomer: [{} as Customer],
  rm: [{} as rm],
  counterParties:[{} as Customer]
};

export { Agreement, inits };
