import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/request/rm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {Invoice} from "../../../../../Model/OAPF/Request/invoice";

@Component({
  selector: 'app-invoicestep2',
  templateUrl: './invoicestep2.component.html',
  styleUrls: ['./invoicestep2.component.scss']
})
export class Invoicestep2Component implements OnInit {

  expiryDate: any
  @Input('updateParentModel') updateParentModel: (part: Partial<Invoice>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Invoice>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input('formElement') formElement :  any;
  @Input() mode :  any;
  @ViewChild('dp') dp: NgbDatepicker;
  public currencyList:any = currencyList;

  constructor(private fb: FormBuilder,private datePipe: DatePipe) {
  }


  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new'){
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      financingRate: [this.defaultValues.financingRate,[Validators.required]],
      financingInterestAmount: [this.defaultValues.financingInterestAmount,[Validators.required]],
      rebateAmount: [this.defaultValues.rebateAmount,[Validators.required]],
      netFinancingInterestAmount: [this.defaultValues.netFinancingInterestAmount,[Validators.required]],
      financeValueDate: [this.defaultValues.financeValueDate,[Validators.required]],
      financeDueDate: [this.defaultValues.financeDueDate,[Validators.required]],
      financeId: [this.defaultValues.financeId,[Validators.required]],
      financingAmount: [this.defaultValues.financingAmount,[Validators.required]],
      financingBalance: [this.defaultValues.financingBalance,[Validators.required]],
      paidBy: [this.defaultValues.paidBy,[Validators.required]],
      paymentDate: [this.defaultValues.paymentDate,[Validators.required]],
      paymentAmount: [this.defaultValues.paymentAmount,[Validators.required]],
      principalPaid: [this.defaultValues.principalPaid,[Validators.required]],
      interestPaid: [this.defaultValues.interestPaid,[Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
      this.form.markAllAsTouched();
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('joiningDate')?.hasError('required') ||
      //this.form.get('validDate')?.hasError('required') ||
      this.form.get('expiryDate')?.hasError('required')
      //|| this.form.get('rolesName')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.financingRate.setValue(this.formValue.financingRate);
    this.f.financingInterestAmount.setValue(this.formValue.financingInterestAmount);
    this.f.rebateAmount.setValue(this.formValue.rebateAmount);
    this.f.netFinancingInterestAmount.setValue(this.formValue.netFinancingInterestAmount);
    const eFinanceValueDate = this.datePipe.transform(new Date(this.formValue.financeValueDate), "yyyy-MM-dd");
    this.f.financeValueDate.setValue(eFinanceValueDate);
    const eFinanceDueDate = this.datePipe.transform(new Date(this.formValue.financeDueDate), "yyyy-MM-dd");
    this.f.financeDueDate.setValue(eFinanceDueDate);

    this.f.financeId.setValue(this.formValue.financeId);
    this.f.financingAmount.setValue(this.formValue.financingAmount);
    this.f.financingBalance.setValue(this.formValue.financingBalance);
    this.f.paidBy.setValue(this.formValue.paidBy);

    const ePaymentDate = this.datePipe.transform(new Date(this.formValue.paymentDate), "yyyy-MM-dd");
    this.f.paymentDate.setValue(ePaymentDate);

    this.f.paymentAmount.setValue(this.formValue.paymentAmount);
    this.f.principalPaid.setValue(this.formValue.principalPaid);
    this.f.interestPaid.setValue(this.formValue.interestPaid);

  }

  get f() {
    return this.form.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.form.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    //const control = this.form.controls[controlName];
    //return control.dirty || control.touched;
    return  false;
  }

}
