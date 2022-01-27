import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExchangeRate,inits } from 'src/app/ReqModal/exchangerate';
import { Holiday } from 'src/app/ReqModal/holiday';

@Component({
  selector: 'app-ex-change-rates-step1',
  templateUrl: './ex-change-rates-step1.component.html',
  styleUrls: ['./ex-change-rates-step1.component.scss']
})
export class ExChangeRatesStep1Component implements OnInit {

  ExchangeRateForm: FormGroup

  @Input('updateParentModel') updateParentModel: (
    part: Partial<ExchangeRate>,
    isFormValid: boolean
  ) => void;
  @Input() defaultValues: Partial<ExchangeRate>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,public datePipe:DatePipe) { }

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.ExchangeRateForm.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.ExchangeRateForm = this.fb.group({
      fromCurrency: [this.defaultValues.fromCurrency,[Validators.required]],
      toCurrency: [this.defaultValues.toCurrency,[Validators.required]],
      rateType: [this.defaultValues.rateType,[Validators.required]],
      rateValue: [this.defaultValues.rateValue,[Validators.required]],
      mdFlag: [this.defaultValues.mdFlag,[Validators.required]],
    });

    const formChangesSubscr = this.ExchangeRateForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.ExchangeRateForm.get('fromCurrency')?.hasError('required') ||
      this.ExchangeRateForm.get('toCurrency')?.hasError('required') ||
      this.ExchangeRateForm.get('rateType')?.hasError('required') ||
      this.ExchangeRateForm.get('mdFlag')?.hasError('required') ||
      this.ExchangeRateForm.get('rateValue')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.ExchangeRateForm.patchValue(this.formValue)
  }

  get f() {
    return this.ExchangeRateForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.ExchangeRateForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.ExchangeRateForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.ExchangeRateForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.ExchangeForm.controls[controlName];
    return false;
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: { firstName: string; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
    }
    return filterFunction;
  }

}
