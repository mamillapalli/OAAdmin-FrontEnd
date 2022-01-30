import {Customer} from "./customer";
import {Agreement} from "./agreement";
import { rm } from "./OAAdmin/Request/rm";

interface Sbr {
  "sbrId": string;
  "directContactFlag": string;
  "expiryDate":string;
  "recourseFlag": string;
  "appliedLimitCurrency": string;
  "limitTypeFlag": string;
  "transactionDate": string;
  "natureOfBusiness": string;
  "goodsDescription": string;
  "appliedLimitAmount": number;
  "anchorPartyAccountId": string;
  "counterPartyAccountId": string;
  "paymentTermsDays": number;
  "paymentTermsCondition": string;
  "commercialContractDetails": string;
  "autoFinanceAvailability": string;
  "autoFinancing": boolean;
  "autoSettlement": boolean;
  "anchorCustomerContactName": string;
  "realBeneficiary": string;
  "anchorCustomerAddressLine1": string;
  "anchorCustomerAddressLine2": string;
  "anchorCustomerAddressLine3": string;
  "anchorCustomerPOBox": string;
  "anchorCustomerEmail": string;
  "anchorCustomerFax": string;
  "anchorCustomerTelephone": string;
  "counterPartyContactName": string;
  "counterPartyAddressLine1": string;
  "counterPartyAddressLine2": string;
  "counterPartyAddressLine3": string;
  "counterPartyPOBox": string;
  "counterPartyEmail": string;
  "counterPartyFax": string;
  "counterPartyTelephone": string;
  "managementFeeCurrency": string;
  "managementFeeAmount": number;
  "administrativeFeeCurrency": string;
  "administrativeFeeAmount": number;
  "earlyPaymentFeeCurrency": string;
  "earlyPaymentAmount": number;
  "factoringCommissionRate": number;
  "financingProfitMarginRate": number;
  "rebateRate": number;
  "rebateAccount": string;
  "financingInformation": string;
  "invoiceServiceChargeCurrency": string;
  "invoiceServiceChargeAmount": number;
  "maxLoanPercentage": number;
  "profitRateType": string;
  "documentsRequired": string;
  "limitReference": string;
  "earMarkReference": string;
  "limitExpiry": string;
  "limitCurrency": string;
  "limitAmount": string;
  "cashMargin": number;
  "interestChargeType":string;
  "interestRateType":string;
  "interestRate":number;
  "interestMargin":number;
  "financeServiceChargeCurrency": string;
  "financeServiceChargeAmount": number;
  "settlementServiceChargeCurrency": string;
  "settlementServiceChargeAmount": number;
  "cableChargeCurrency": string;
  "cableChargeAmount": number;
  "communicationChargeCurrency": string;
  "communicationChargeAmount": number;
  "agreement":[Agreement];
  "agreementId": string
  "anchorCustomer":[Customer];
  "anchorCustomerId":string;
  "counterParty":[Customer];
  "counterPartyId":string;
  "rm":[rm];
  "rmId":string;
  "checkCustomer":boolean;
  "counterPartyApprovalRequired":boolean;
  "anchorPartyApprovalRequired":boolean;

}
const inits: Sbr = {
  "sbrId": '',
  "expiryDate":'',
  "directContactFlag": '',
  "recourseFlag": '',
  "appliedLimitCurrency": '',
  "limitTypeFlag": '',
  "transactionDate": '',
  "natureOfBusiness": '',
  "goodsDescription": '',
  "appliedLimitAmount": 0.00,
  "anchorPartyAccountId": '',
  "counterPartyAccountId": '',
  "paymentTermsDays":0,
  "paymentTermsCondition": '',
  "commercialContractDetails": '',
  "autoFinanceAvailability": '',
  "autoFinancing": false,
  "autoSettlement": false,
  "anchorCustomerContactName": '',
  "realBeneficiary": '',
  "anchorCustomerAddressLine1": '',
  "anchorCustomerAddressLine2": '',
  "anchorCustomerAddressLine3": '',
  "anchorCustomerPOBox": '',
  "anchorCustomerEmail": '',
  "anchorCustomerFax": '',
  "anchorCustomerTelephone": '',
  "counterPartyContactName": '',
  "counterPartyAddressLine1": '',
  "counterPartyAddressLine2": '',
  "counterPartyAddressLine3": '',
  "counterPartyPOBox": '',
  "counterPartyEmail": '',
  "counterPartyFax": '',
  "counterPartyTelephone": '',
  "managementFeeCurrency": '',
  "managementFeeAmount": 0.00,
  "administrativeFeeCurrency": '',
  "administrativeFeeAmount": 0.00,
  "earlyPaymentFeeCurrency": '',
  "earlyPaymentAmount": 0.00,
  "factoringCommissionRate": 0.00,
  "financingProfitMarginRate": 0.00,
  "rebateRate": 0.00,
  "rebateAccount": '',
  "financingInformation": '',
  "invoiceServiceChargeCurrency": '',
  "invoiceServiceChargeAmount": 0.00,
  "maxLoanPercentage": 0.00,
  "profitRateType": '',
  "documentsRequired": '',
  "limitReference": '',
  "earMarkReference": '',
  "limitExpiry": '',
  "limitCurrency": '',
  "limitAmount": '',
  "cashMargin": 0.00,
  interestMargin:0.00,
  interestRate:0.00,
  interestChargeType:'',
  interestRateType:'',
  "financeServiceChargeCurrency": '',
  "financeServiceChargeAmount": 0.00,
  "settlementServiceChargeCurrency": '',
  "settlementServiceChargeAmount": 0.00,
  "cableChargeCurrency": '',
  "cableChargeAmount": 0.00,
  "communicationChargeCurrency": '',
  "communicationChargeAmount": 0.00,
  "agreement":[{} as Agreement],
  "agreementId":'',
  "anchorCustomer":[{} as Customer],
  "anchorCustomerId": '',
  "counterParty":[{} as Customer],
  "counterPartyId":'',
  "rm":[{} as rm],
  "rmId":'',
  checkCustomer: false,
  anchorPartyApprovalRequired: false,
  counterPartyApprovalRequired: false,
}

export { Sbr, inits };
