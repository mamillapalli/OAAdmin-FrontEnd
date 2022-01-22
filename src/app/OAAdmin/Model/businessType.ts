interface BusinessType {
    code: string;
    name: string;
    effectiveDate: string;
    expiryDate: string;
  }
  
  const inits: BusinessType = {
    code: '',
    name:  '',
    effectiveDate:  '',
    expiryDate:  ''
  }
  
  export { BusinessType, inits };
  