interface Invoice {
  "invoiceNumber": string,
  "sbrReferenceId": string,
  "agreementId": string,
  "anchorId": string,
  "counterPartyId": string,
  "documentType": string,
  "documentNumber": string,
  "currency": string,
  "amount": number,
  "date": Date,
  "valueDate": Date,
  "dueDate": Date,
  "portOfLoading": string,
  "portOfDischarge": string,
  "shipmentCorporation": string,
  "realBeneficiary": string,
  "financeId": string,
  "invoiceServiceChargeCurrency": string
  "invoiceServiceChargeAmount": number,
  // "anchorPartyApprovalRequired": boolean,
  // "counterPartyApprovalRequired": boolean,
  // "anchorPartyApproved": boolean,
  // "counterPartyApproved": boolean,
  // "autoFinance": boolean,
  // "autoSettlement": boolean,
}
const inits: Invoice = {
  "invoiceNumber": "",
  "sbrReferenceId": "",
  "agreementId": "",
  "anchorId": "",
  "counterPartyId": "",
  "documentType": "",
  "documentNumber": "",
  "currency": "",
  "amount": 0.00,
  "date": new Date,
  "valueDate": new Date,
  "dueDate": new Date,
  "portOfLoading": "",
  "portOfDischarge": "",
  "shipmentCorporation": "",
  "realBeneficiary": "",
  "financeId": "",
  "invoiceServiceChargeCurrency": "",
  "invoiceServiceChargeAmount": 0.00,
  // "anchorPartyApprovalRequired": false,
  // "counterPartyApprovalRequired": false,
  // "anchorPartyApproved": false,
  // "counterPartyApproved": false,
  // "autoFinance": false,
  // "autoSettlement": false,

}

export { Invoice, inits };
