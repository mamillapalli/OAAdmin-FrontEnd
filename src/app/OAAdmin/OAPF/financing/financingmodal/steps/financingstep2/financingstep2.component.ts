import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Invoice} from "../../../../../Model/OAPF/Request/invoice";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {financing} from "../../../../../Model/OAPF/Request/financing";
import {AccountcommonmodalComponent} from "../../../../common/accountcommonmodal/accountcommonmodal.component";
import { financingService} from "../../../../../shared/OAPF/financing.service";
import {NotificationService} from "../../../../../shared/notification.service";

@Component({
  selector: 'app-financingstep2',
  templateUrl: './financingstep2.component.html',
  styleUrls: ['./financingstep2.component.scss']
})
export class Financingstep2Component implements OnInit {
  expiryDate: any
  @Input('updateParentModel') updateParentModel: (part: Partial<financing>,isFormValid: boolean) => void;
  //financingForm: FormGroup;
  @Input() defaultValues: Partial<financing>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input('formElement') formElement :  any;
  @Input() mode :  any;
  @ViewChild('dp') dp: NgbDatepicker;
  public currencyList:any = currencyList;
  @Input('financingForm') financingForm: FormGroup;
  modalOption: NgbModalOptions = {};
  @Input('calculatedDetails') calculatedDetails: any

  constructor(private fb: FormBuilder,
              public modalService: NgbModal,
              public financingService: financingService,
              private notifyService : NotificationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.financingForm.disable()
    }
    if(this.mode !== 'new'){
      this.updateForm();
    }
    if(this.mode === 'new' || this.mode === 'Edit')
    {
      this.financingForm.patchValue(this.calculatedDetails)
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.financingForm = this.fb.group({
      financeCurrency: [this.defaultValues.financeCurrency,[Validators.required]],
      financeAmount: [this.defaultValues.financeAmount,[Validators.required]],
      totalInvoiceCurrency: [this.defaultValues.totalInvoiceCurrency,[Validators.required]],
      totalInvoiceAmount: [this.defaultValues.totalInvoiceAmount,[Validators.required]],
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
      diaryId: [this.defaultValues.diaryId,[Validators.required]],
      diaryDueDate: [this.defaultValues.diaryDueDate,[Validators.required]],
      diaryNarrative: [this.defaultValues.diaryNarrative,[Validators.required]],
      financeDueDate: [this.defaultValues.financeDueDate,[Validators.required]],
      financeTotalDueCurrency: [this.defaultValues.financeTotalDueCurrency,[Validators.required]],
      financeTotalDueAmount: [this.defaultValues.financeTotalDueAmount,[Validators.required]],
      deleteFlag: [this.defaultValues.deleteFlag,[Validators.required]],
      financeServiceChargeCurrency: [this.defaultValues.financeServiceChargeCurrency,[Validators.required]],
      financeServiceChargeAmount: [this.defaultValues.financeServiceChargeAmount,[Validators.required]],
      interestCurrency: [this.defaultValues.interestCurrency,[Validators.required]],
      interestAmount: [this.defaultValues.interestAmount,[Validators.required]]
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
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(AccountcommonmodalComponent, this.modalOption);
    modalRef.componentInstance.accountParam = 'MASTER';
    modalRef.result.then((result) => {
      console.log('result is ' + result);
      if(result != null) {
        this.f.debitAccount.setValue(result.accountId)
      }
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }

  openCreditAccount() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(AccountcommonmodalComponent, this.modalOption);
    modalRef.componentInstance.accountParam = 'MASTER';
    modalRef.result.then((result) => {
      console.log('result is ' + result);
      if(result != null) {
        this.f.creditAccount.setValue(result.accountId)
      }
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }

  calculateFinanceDetails() {
    //this.checkBusinessValidation()
    console.log('Calaculate details object is '+ JSON.stringify(this.calculatedDetails))
    this.financingService.CalculateFinanceDetails(this.calculatedDetails).subscribe((res: any) => {
        console.log('response invoice calculate details is '+res)
        this.calculatedDetails = res
        this.financingForm.patchValue(res)
      }, (err: any) => console.log('HTTP Error', err),
      () => console.log('HTTP request completed.'))
  }

  private checkBusinessValidation() {
    if(this.financingForm.value.financeAmount > this.financingForm.value.totalAvailableAmount )
    {
        this.notifyService.showWarning('Finance should not greater than Total Invoice Amount','BusinessValidation')
    }
  }
}
