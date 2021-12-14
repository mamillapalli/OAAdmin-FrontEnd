interface Accounts {
  "accountId": string,
  "name": string,
  "type": string,
  "description": string,
  "currency": string,
  "status": boolean
}
const inits: Accounts = {
  "accountId": "",
  "name": "",
  "type": "",
  "description": "",
  "currency": "",
  "status": true
}

export { Accounts, inits };
