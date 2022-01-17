export class cInvoice {
  "invoiceNumber": string;
  "sbrReferenceId": string;
  "agreementId": string;
  "anchorId": string;
  "counterPartyId": string;
  "documentType": string;
  "documentNumber": string;
  "currency": string;
  "amount": number;
  "date": Date;
  "valueDate": Date;
  "dueDate": Date;
  "portOfLoading": string;
  "portOfDischarge": string;
  "shipmentCorporation": string;
  "realBeneficiary": string;
  "financeId": string;
  "invoiceServiceChargeCurrency": string
  "invoiceServiceChargeAmount": number;
  constructor(d: any) {
    this.invoiceNumber = d.invoiceNumber;
    this.sbrReferenceId = d.sbrReferenceId;
    this.agreementId = d.agreementId;
    this.anchorId = d.anchorId;
    this.counterPartyId = d.counterPartyId;
    this.documentType = d.documentType;
    this.documentNumber = d.documentNumber;
    this.currency = d.currency;
    this.amount = d.amount;
    this.date = d.date;
    this.valueDate = d.valueDate;
    this.dueDate = d.dueDate;
    this.portOfLoading = d.portOfLoading;
    this.portOfDischarge = d.portOfDischarge;
    this.shipmentCorporation = d.shipmentCorporation;
    this.realBeneficiary = d.realBeneficiary;
    this.financeId = d.financeId;
    this.invoiceServiceChargeCurrency = d.invoiceServiceChargeCurrency;
    this.invoiceServiceChargeAmount = d.invoiceServiceChargeAmount;
  }
}
