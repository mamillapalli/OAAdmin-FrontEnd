import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import { Currency } from 'src/app/ReqModal/currency';
import { countries } from 'src/app/OAAdmin/Model/country-data-store';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Currency>,
    isFormValid: boolean
  ) => void;
  CurrencyForm: FormGroup;
  @Input() defaultValues: Partial<Currency>;

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
  public countries:any = countries;

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.CurrencyForm.disable()
    }
    if(this.mode !== 'new') {
      this.f.isoCode.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.CurrencyForm = this.fb.group({
      isoCode: [this.defaultValues.isoCode,[Validators.required]],
      description: [this.defaultValues.description,[Validators.required]],
      country: [this.defaultValues.country,[Validators.required]],
      minorName: [this.defaultValues.minorName,[Validators.required]],
      majorName: [this.defaultValues.majorName,[Validators.required]],
      decimal: [this.defaultValues.decimal,[Validators.required]],
      baseDays: [this.defaultValues.baseDays,[Validators.required]],
    });

    const formChangesSubscr = this.CurrencyForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.CurrencyForm.get('isoCode')?.hasError('required') ||
      this.CurrencyForm.get('description')?.hasError('required') ||
      this.CurrencyForm.get('country')?.hasError('required') ||
      this.CurrencyForm.get('minorName')?.hasError('required') ||
      this.CurrencyForm.get('majorName')?.hasError('required')||
      this.CurrencyForm.get('decimal')?.hasError('required') ||
      this.CurrencyForm.get('baseDays')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.CurrencyForm.patchValue(this.formValue)
  }

  get f() {
    return this.CurrencyForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.CurrencyForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.CurrencyForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.CurrencyForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.form.controls[controlName];
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
