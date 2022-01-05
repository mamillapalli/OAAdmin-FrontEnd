import {voucherEntries} from "./voucherEntries";

interface voucher{
  "createdUser": string,
  "modifiedUser": string,
  "createdDate": Date,
  "modifiedDate": Date,
  "authorisedUser": string,
  "authorisationDate": Date,
  "transactionStatus": string,
  "systemId": string,
  "transactionId": string,
  "voucherName": string,
  "voucherDescription": string,
  "voucherEntries": [voucherEntries]
}

const inits: voucher = {
  "createdUser": "",
  "modifiedUser": "",
  "createdDate": new Date,
  "modifiedDate": new Date,
  "authorisedUser": "",
  "authorisationDate": new Date,
  "transactionStatus": "",
  "systemId": "",
  "transactionId": "",
  "voucherName": "",
  "voucherDescription": "",
  "voucherEntries": {} as [voucherEntries]
}

export { voucher, inits };
