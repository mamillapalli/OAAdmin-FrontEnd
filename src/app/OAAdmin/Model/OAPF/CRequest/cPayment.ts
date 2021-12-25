import {financing} from "../Request/financing";
export class cPayment {
  "paymentId": string
  "sbrReferenceId": string
  "agreementId": string
  "buyerId": string
  "sellerId": string
  "buyerName": string
  "sellerName": string
  "paymentType": string
  "businessType": string
  "transactionDate": Date
  "finance": [financing]
  "valueDate": Date
  "paymentCurrency": string
  "paymentAmount": number
  "financeCurrency": string
  "financeTotalDue": number
  "financePrincipalDue": number
  "financeInterestDue": number
  "principalSettled": number
  "interestSettled": number
  "interestRefunded": number
  "cableChargeCurrency": string
  "cableChargeAmount": number
  "communicationChargeCurrency": string
  "communicationChargeAmount": number
  "newFinanceTotalDue": number
  "paymentNotes": string
  "refundInterestDetails": string
  "debitAccount": string
  "creditAccount": string
  "diaryId": string
  "diaryDueDate": string
  "diaryNarrative": string
  "deleteFlag": boolean
  "totalSettled": string
}
