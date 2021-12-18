import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Invoice} from "../../../../../Model/OAPF/Request/invoice";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {financing} from "../../../../../Model/OAPF/Request/financing";

@Component({
  selector: 'app-financingstep2',
  templateUrl: './financingstep2.component.html',
  styleUrls: ['./financingstep2.component.scss']
})
export class Financingstep2Component implements OnInit {
  expiryDate: any
  @Input('updateParentModel') updateParentModel: (part: Partial<financing>,isFormValid: boolean) => void;
  financingForm: FormGroup;
  @Input() defaultValues: Partial<financing>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input('formElement') formElement :  any;
  @Input() mode :  any;
  @ViewChild('dp') dp: NgbDatepicker;
  public currencyList:any = currencyList;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.financingForm.disable()
    }
    if(this.mode !== 'new'){
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.financingForm = this.fb.group({
      financeCurrency: [this.defaultValues.financeCurrency,[Validators.required]],
      financeAmount: [this.defaultValues.financeAmount,[Validators.required]],
      maxFinancePercentage: [this.defaultValues.maxFinancePercentage,[Validators.required]],
      interestChargeType: [this.defaultValues.interestChargeType,[Validators.required]],
      interestRateType: [this.defaultValues.interestRateType,[Validators.required]],
      interestRate: [this.defaultValues.interestRate,[Validators.required]],
      interestMargin: [this.defaultValues.interestMargin,[Validators.required]],
      valueDate: ['',[Validators.required]],
      graceDays: [this.defaultValues.graceDays,[Validators.required]],
      financingInterestRate: [this.defaultValues.financingInterestRate,[Validators.required]],
      upfrontInterestAmount: [this.defaultValues.upfrontInterestAmount,[Validators.required]],
      totalAvailableCurrency: [this.defaultValues.totalAvailableCurrency,[Validators.required]],
      totalAvailableAmount: [this.defaultValues.totalAvailableAmount,[Validators.required]],
      toSellerCurrency: [this.defaultValues.toSellerCurrency,[Validators.required]],
      toSellerAmount: [this.defaultValues.toSellerAmount,[Validators.required]],
      debitAccount: [this.defaultValues.debitAccount,[Validators.required]],
      creditAccount: [this.defaultValues.creditAccount,[Validators.required]],
      financeDueDate: ['',[Validators.required]]
    });

    const formChangesSubscr = this.financingForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.financingForm.get('joiningDate')?.hasError('required')
    );
  }

  updateForm()
  {
    this.financingForm.patchValue(this.formValue)
  }

  get f() {
    return this.financingForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.financingForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.financingForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.financingForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    //const control = this.form.controls[controlName];
    //return control.dirty || control.touched;
    return  false;
  }

}
