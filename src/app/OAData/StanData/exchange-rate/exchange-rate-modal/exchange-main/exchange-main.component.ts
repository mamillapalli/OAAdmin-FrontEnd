import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {HttpClient} from "@angular/common/http";
import { ExchangeRate } from 'src/app/ReqModal/exchangerate';
@Component({
  selector: 'app-exchange-main',
  templateUrl: './exchange-main.component.html',
  styleUrls: ['./exchange-main.component.scss']
})
export class ExchangeMainComponent implements OnInit {


  @Input('updateParentModel') updateParentModel: (
    part: Partial<ExchangeRate>,
    isFormValid: boolean
  ) => void;
  ExchangeForm: FormGroup;
  @Input() defaultValues: Partial<ExchangeRate>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  public currencyList:any = currencyList;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal) { }

  ngOnInit(): void {
    this.initForm(); 
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.ExchangeForm.disable()
    }
    if(this.mode !== 'new') {
      this.f.rateValue.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.ExchangeForm = this.fb.group({
      fromCurrency: [this.defaultValues.fromCurrency,[Validators.required]],
      toCurrency: [this.defaultValues.toCurrency,[Validators.required]],
      rateType: [this.defaultValues.rateType,[Validators.required]],
      rateValue: [this.defaultValues.rateValue,[Validators.required]],
      mdFlag: [this.defaultValues.mdFlag,[Validators.required]],
    });

    const formChangesSubscr = this.ExchangeForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.ExchangeForm.get('fromCurrency')?.hasError('required') ||
      this.ExchangeForm.get('fromCurrency')?.hasError('required') ||
      this.ExchangeForm.get('rateType')?.hasError('required') ||
      this.ExchangeForm.get('rateType')?.hasError('required') ||
      this.ExchangeForm.get('mdFlag')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.ExchangeForm.patchValue(this.formValue)
  }

  get f() {
    return this.ExchangeForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.ExchangeForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.ExchangeForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.ExchangeForm.controls[controlName];
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
