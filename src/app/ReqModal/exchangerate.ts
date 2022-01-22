interface ExchangeRate {
    fromCurrency: string;
    toCurrency: string;
    rateType: string;
    rateValue: string;
    mdFlag: string;
  }
  
  const inits: ExchangeRate = {
    fromCurrency: '',
    toCurrency: '',
    rateType: '',
    rateValue: '',
    mdFlag: '',
  };
  
  export { ExchangeRate, inits };