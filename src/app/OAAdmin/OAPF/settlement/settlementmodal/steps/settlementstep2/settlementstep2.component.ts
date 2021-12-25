import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {financing} from "../../../../../Model/OAPF/Request/financing";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {Payment} from "../../../../../Model/OAPF/Request/payment";
import {FinancemodalComponent} from "../../../../common/financemodal/financemodal.component";
import {AccountcommonmodalComponent} from "../../../../common/accountcommonmodal/accountcommonmodal.component";
import {NotificationService} from "../../../../../shared/notification.service";
@Component({
  selector: 'app-settlementstep2',
  templateUrl: './settlementstep2.component.html',
  styleUrls: ['./settlementstep2.component.scss']
})
export class Settlementstep2Component implements OnInit {

  expiryDate: any
  @Input('updateParentModel') updateParentModel: (part: Partial<Payment>,isFormValid: boolean) => void;
  financingForm: FormGroup;
  @Input() defaultValues: Partial<Payment>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input('formElement') formElement :  any;
  @Input() mode :  any;
  @ViewChild('dp') dp: NgbDatepicker;
  public currencyList:any = currencyList;
  modalOption: NgbModalOptions = {};
  @Output() accountParam: any


  constructor(private fb: FormBuilder,public modalService: NgbModal,private notifyService : NotificationService) { }

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
      paymentCurrency: [this.defaultValues.paymentCurrency,[Validators.required]],
      paymentAmount: [this.defaultValues.paymentAmount,[Validators.required]],
      financeCurrency: [this.defaultValues.financeCurrency,[Validators.required]],
      financeTotalDue: [this.defaultValues.financeTotalDue,[Validators.required]],
      financePrincipalDue: [this.defaultValues.financePrincipalDue,[Validators.required]],
      financeInterestDue: [this.defaultValues.financeInterestDue,[Validators.required]],
      principalSettled: [this.defaultValues.principalSettled,[Validators.required]],
      interestSettled: [this.defaultValues.interestSettled,[Validators.required]],
      interestRefunded: [this.defaultValues.interestRefunded,[Validators.required]],
      cableChargeCurrency: [this.defaultValues.cableChargeCurrency,[Validators.required]],
      cableChargeAmount: [this.defaultValues.cableChargeAmount,[Validators.required]],
      communicationChargeCurrency: [this.defaultValues.communicationChargeCurrency,[Validators.required]],
      communicationChargeAmount: [this.defaultValues.communicationChargeAmount,[Validators.required]],
      newFinanceTotalDue: [this.defaultValues.newFinanceTotalDue,[Validators.required]],
      paymentNotes: [this.defaultValues.paymentNotes,[Validators.required]],
      refundInterestDetails: [this.defaultValues.refundInterestDetails,[Validators.required]],
      debitAccount: [this.defaultValues.debitAccount,[Validators.required]],
      creditAccount: [this.defaultValues.creditAccount,[Validators.required]],
      totalSettled: [this.defaultValues.totalSettled,[Validators.required]],
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

  openDebitAccount() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(AccountcommonmodalComponent, this.modalOption);
    modalRef.componentInstance.accountParam = 'MASTER';
    modalRef.result.then((result) => {
      console.log('result is ' + result);
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }

  openCreditAccount() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(AccountcommonmodalComponent, this.modalOption);
    modalRef.componentInstance.accountParam = 'MASTER';
    modalRef.result.then((result) => {
      console.log('result is ' + result);
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }
}
