import {Invoice} from "./invoice";

interface financing {
  financeId: string,
  sbrReferenceId: string,
  agreementId: string,
  buyerId: string,
  sellerId: string,
  buyerName: string,
  sellerName: string,
  financingType: string,
  businessType: string,
  transactionDate: Date,
  invoiceList: [Invoice]
  totalInvoiceCurrency: string
  totalInvoiceAmount: number
  financeCurrency: string,
  financeAmount: number
  financeTotalCurrency: string,
  financeTotalAmount: number
  maxFinancePercentage: number
  interestChargeType: string,
  interestRateType: string,
  interestRate: number
  interestMargin: number
  valueDate: Date,
  graceDays: number
  financingInterestRate: number
  upfrontInterestAmount: number
  totalAvailableCurrency: string,
  totalAvailableAmount: number
  toSellerCurrency: string,
  toSellerAmount: number
  debitAccount: string,
  creditAccount: string,
  diaryId: string,
  diaryDueDate: Date
  diaryNarrative: string,
  financeDueDate: Date,
  deleteFlag: boolean
  financeServiceChargeCurrency: string,
  financeServiceChargeAmount: number
  interestCurrency: string,
  interestAmount: number
}

const inits: financing = {
  financeId: '',
  sbrReferenceId: '',
  agreementId: '',
  buyerId: '',
  sellerId: '',
  buyerName: '',
  sellerName: '',
  financingType: '',
  businessType: '',
  transactionDate: new Date,
  invoiceList: [{} as Invoice],
  totalInvoiceCurrency: '',
  totalInvoiceAmount: 0,
  financeCurrency: '',
  financeAmount: 0,
  financeTotalCurrency: '',
  financeTotalAmount: 0,
  maxFinancePercentage: 0,
  interestChargeType: '',
  interestRateType: '',
  interestRate: 0,
  interestMargin: 0,
  valueDate: new Date,
  graceDays: 0,
  financingInterestRate: 0,
  upfrontInterestAmount: 0,
  totalAvailableCurrency: '',
  totalAvailableAmount: 0,
  toSellerCurrency: '',
  toSellerAmount: 0,
  debitAccount: '',
  creditAccount: '',
  diaryId: '',
  diaryDueDate: new Date,
  diaryNarrative: '',
  financeDueDate: new Date,
  deleteFlag: false,
  financeServiceChargeCurrency: '',
  financeServiceChargeAmount: 0,
  interestCurrency: '',
  interestAmount: 0,

}
export {financing, inits};
