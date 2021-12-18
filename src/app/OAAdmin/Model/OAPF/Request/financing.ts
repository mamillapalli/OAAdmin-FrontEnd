import {Invoice} from "./invoice";

interface financing {
  agreementId: string
  businessType: string
  buyerId: string
  buyerName: string
  creditAccount: string
  debitAccount: string
  deleteFlag: boolean
  diaryDueDate: Date
  diaryId: string
  diaryNarrative: string
  financeAmount: number
  financeCurrency: string
  financeDueDate: Date
  financeId: string
  financingInterestRate: number
  financingType: string
  graceDays: number
  interestChargeType: string
  interestMargin: number
  interestRate: number
  interestRateType: string
  invoiceList: [Invoice]
  maxFinancePercentage: number
  sbrReferenceId: string
  sellerId: string
  sellerName: string
  systemId: string
  toSellerAmount: number
  toSellerCurrency: string
  totalAvailableAmount: number
  totalAvailableCurrency: string
  transactionDate: string
  upfrontInterestAmount: number
  valueDate: Date
}

const inits: financing = {
  agreementId: "",
  businessType: "",
  buyerId: "",
  buyerName: "",
  creditAccount: "",
  debitAccount: "",
  deleteFlag: false,
  diaryDueDate: new Date,
  diaryId: "",
  diaryNarrative: "",
  financeAmount: 0,
  financeCurrency: "",
  financeDueDate: new Date,
  financeId: "",
  financingInterestRate: 0,
  financingType: "",
  graceDays: 0,
  interestChargeType: "",
  interestMargin: 0,
  interestRate: 0,
  interestRateType: "",
  invoiceList: [{} as Invoice] ,
  maxFinancePercentage: 0,
  sbrReferenceId: "",
  sellerId: "",
  sellerName: "",
  systemId: "",
  toSellerAmount: 0,
  toSellerCurrency: "",
  totalAvailableAmount: 0,
  totalAvailableCurrency: "",
  transactionDate: "",
  upfrontInterestAmount: 0,
  valueDate: new Date

}
export {financing, inits};
