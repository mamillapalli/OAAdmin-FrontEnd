interface InterestRate {
    name: string;
    description: string;
    rateValue: string;
    deleteFlag: string;
    transactionStatus: string;
  }
  
  const inits: InterestRate = {
    name: '',
    description: '',
    rateValue: '',
    deleteFlag: '',
    transactionStatus: '',
  };
  
  export { InterestRate, inits };