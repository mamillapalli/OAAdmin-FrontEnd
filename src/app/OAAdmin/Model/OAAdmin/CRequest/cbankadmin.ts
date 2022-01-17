export class cbankadmin {
  userId: string
  firstName: string
  lastName: string
  effectiveDate: string
  expiryDate: string
  emailAddress : string
  roles: []
  status : boolean

  constructor(d:any) {
    this.userId = d.userId
    this.firstName =  d.firstName
    this.lastName =  d.lastName
    this.effectiveDate=  d.effectiveDate
    this.expiryDate=  d.expiryDate
    this.emailAddress =  d.emailAddress
    this.roles =  d.roles
    this.status =  d.status
  }

}
