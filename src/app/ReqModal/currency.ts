interface Currency {
    description: string;
    country: string;
    isoCode: string;
    minorName: string;
    majorName: string;
    decimal: string;
    baseDays : string;
  }
  
  const inits: Currency = {
    description: '',
    country: '',
    isoCode: '',
    minorName: '',
    majorName: '',
    decimal: '',
    baseDays : ''
  };
  
  export { Currency, inits };
  