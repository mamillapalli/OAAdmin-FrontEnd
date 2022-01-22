import {financing} from "../Request/financing";

export class sendingfinacing {
  financeId: string
  constructor(d:any) {
    this.financeId = d.financeId
  }
}

export class cPayment {
  "paymentId": string;
  "sbrReferenceId": string;
  "agreementId": string;
  "buyerId": string;
  "sellerId": string;
  "buyerName": string;
  "sellerName": string;
  "paymentType": string;
  "businessType": string;
  "transactionDate": Date;
  "finance": sendingfinacing
  "valueDate": Date;
  "paymentCurrency": string;
  "paymentAmount": number;
  "financeCurrency": string;
  "financeTotalDue": number;
  "paymentTotalDue": number;
  "interestRefunded": number;
  "cableChargeCurrency": string;
  "cableChargeAmount": number;
  "communicationChargeCurrency": string;
  "communicationChargeAmount": number;
  "paymentNotes": string;
  "refundInterestDetails": string;
  "debitAccount": string;
  "creditAccount": string;
  "diaryId": string;
  "diaryDueDate": string;
  "diaryNarrative": string;

  constructor(d: any) {
    this.paymentId = d.paymentId;
    this.sbrReferenceId = d.sbrReferenceId;
    this.agreementId = d.agreementId
    this.buyerId = d.buyerId
    this.sellerId = d.sellerId
    this.buyerName = d.buyerName
    this.sellerName = d.sellerName
    this.paymentType = d.paymentType
    this.businessType = d.businessType
    this.transactionDate = d.transactionDate
    this.finance = new sendingfinacing(d.finance)
    this.valueDate = d.valueDate
    this.paymentCurrency = d.paymentCurrency
    this.paymentAmount = d.paymentAmount
    this.financeCurrency = d.financeCurrency
    this.financeTotalDue = d.financeTotalDue
    this.paymentTotalDue = d.paymentTotalDue
    this.interestRefunded = d.interestRefunded
    this.cableChargeCurrency = d.cableChargeCurrency
    this.cableChargeAmount = d.cableChargeAmount
    this.communicationChargeCurrency = d.communicationChargeCurrency
    this.communicationChargeAmount = d.communicationChargeAmount
    this.paymentNotes = d.paymentNotes
    this.refundInterestDetails = d.refundInterestDetails
    this.debitAccount = d.debitAccount
    this.creditAccount = d.creditAccount
    this.diaryId = d.diaryId
    this.diaryDueDate = d.diaryDueDate
    this.diaryNarrative = d.diaryNarrative
  }
}
