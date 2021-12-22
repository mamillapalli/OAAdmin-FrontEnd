import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {ICreateAccount} from "../../../../../modules/wizards/create-account.helper";
import {Agreement} from "../../../../Model/agreement";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
@Component({
  selector: 'app-agreement-limit',
  templateUrl: './agreement-limit.component.html',
  styleUrls: ['./agreement-limit.component.scss']
})
export class AgreementLimitComponent implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Agreement>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Agreement>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  public currencyList:any = currencyList;

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,private datePipe: DatePipe) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      limitExpiry: [this.defaultValues.limitExpiry,[Validators.required]],
      limitReference: [this.defaultValues.limitReference,[Validators.required]],
      limitCurrency: [this.defaultValues.limitCurrency,[Validators.required]],
      limitAmount: [this.defaultValues.limitAmount,[Validators.required]],
      cashMargin: [this.defaultValues.cashMargin,[Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
      this.form.markAllAsTouched();
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('limitExpiry')?.hasError('required') ||
      this.form.get('limitReference')?.hasError('required') ||
      this.form.get('limitCurrency')?.hasError('required') ||
      this.form.get('limitAmount')?.hasError('required') ||
      this.form.get('cashMargin')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.limitReference.setValue(this.formValue.limitReference);
    this.f.limitCurrency.setValue(this.formValue.limitCurrency);
    this.f.limitAmount.setValue(this.formValue.limitAmount);
    this.f.cashMargin.setValue(this.formValue.cashMargin);
    const elmtExpiry = this.datePipe.transform(new Date(this.formValue.limitExpiry), "yyyy-MM-dd");
    this.f.limitExpiry.setValue(elmtExpiry);
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
    const control = this.form.controls[controlName];
    return control.dirty || control.touched;
  }
}
