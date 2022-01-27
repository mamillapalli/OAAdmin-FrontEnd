interface exchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rateType: string;
  rateValue: string | any;
  mdFlag: string | any;
}

const inits: exchangeRate = {
  fromCurrency: "",
  toCurrency:"",
  rateType: "",
  rateValue: "",
  mdFlag: "",
};

export { exchangeRate, inits };
