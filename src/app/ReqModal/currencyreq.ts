export class CurrencyReq {
    description: string;
    country: string;
    isoCode: string;
    minorName: string;
    majorName: string;
    decimal: string;
    baseDays : string;

    constructor(d:any) {
      this.description =  d.description;
      this.country = d.country;
      this.isoCode = d.isoCode;
      this.minorName = d.minorName;
      this.majorName = d.majorName;
      this.decimal = d.decimal;
      this.baseDays = d.baseDays;

    }
}
