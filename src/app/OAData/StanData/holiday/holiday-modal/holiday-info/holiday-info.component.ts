import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {HttpClient} from "@angular/common/http";
import { Holiday } from 'src/app/ReqModal/holiday';
@Component({
  selector: 'app-holiday-info',
  templateUrl: './holiday-info.component.html',
  styleUrls: ['./holiday-info.component.scss']
})
export class HolidayInfoComponent implements OnInit {


  @Input('updateParentModel') updateParentModel: (
    part: Partial<Holiday>,
    isFormValid: boolean
  ) => void;
  HolidayForm: FormGroup;
  @Input() defaultValues: Partial<Holiday>;
  
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
      this.HolidayForm.disable()
    }
    if(this.mode !== 'new') {
      this.f.name.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.HolidayForm = this.fb.group({
      name: [this.defaultValues.name,[Validators.required]],
      description: [this.defaultValues.description,[Validators.required]],
      businessUnit: [this.defaultValues.businessUnit,[Validators.required]],
      date: [this.defaultValues.date,[Validators.required]],
    });

    const formChangesSubscr = this.HolidayForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.HolidayForm.get('name')?.hasError('required') ||
      this.HolidayForm.get('description')?.hasError('required') ||
      this.HolidayForm.get('businessUnit')?.hasError('required') ||
      this.HolidayForm.get('date')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.HolidayForm.patchValue(this.formValue)
  }

  get f() {
    return this.HolidayForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.HolidayForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.HolidayForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.HolidayForm.controls[controlName];
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

