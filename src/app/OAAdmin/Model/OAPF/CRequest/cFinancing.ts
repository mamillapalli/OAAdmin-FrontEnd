import {Invoice} from "../Request/invoice";

export class cFinancing{
  financeId: string
  sbrReferenceId: string
  agreementId: string
  buyerId: string
  sellerId: string
  buyerName: string
  sellerName: string
  financingType: string
  businessType: string
  transactionDate :  Date = new Date()
  invoiceList: [Invoice]
  totalInvoiceCurrency: string
  totalInvoiceAmount: number
  financeCurrency: string
  financeAmount: number
  financeTotalDueCurrency: string
  financeTotalDueAmount: number
  maxFinancePercentage: number
  interestChargeType: string
  interestRateType: string
  interestRate: number
  interestMargin: number
  valueDate: Date
  graceDays: number
  financingInterestRate: number
  upfrontInterestAmount: number
  totalAvailableCurrency: string
  totalAvailableAmount: number
  toSellerCurrency: string
  toSellerAmount: number
  debitAccount: string
  creditAccount: string
  diaryId: string
  diaryDueDate: Date
  diaryNarrative: string
  financeDueDate: Date
  deleteFlag: boolean
  financeServiceChargeCurrency: string
  financeServiceChargeAmount: number
  interestCurrency: string
  interestAmount: number
  //transactionStatus: string
  //status : string

}
