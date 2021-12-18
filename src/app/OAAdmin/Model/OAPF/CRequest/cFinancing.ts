import {Invoice} from "../Request/invoice";

export class cFinancing{
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
