import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {HttpClient} from "@angular/common/http";
import { InterestRate } from 'src/app/ReqModal/interestrate';
@Component({
  selector: 'app-interest-rate-main',
  templateUrl: './interest-rate-main.component.html',
  styleUrls: ['./interest-rate-main.component.scss']
})
export class InterestRateMainComponent implements OnInit {


  @Input('updateParentModel') updateParentModel: (
    part: Partial<InterestRate>,
    isFormValid: boolean
  ) => void;
  InterestForm: FormGroup;
  @Input() defaultValues: Partial<InterestRate>;

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
      this.InterestForm.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.InterestForm = this.fb.group({
      name: [this.defaultValues.name,[Validators.required]],
      description: [this.defaultValues.description,[Validators.required]],
      rateValue: [this.defaultValues.rateValue,[Validators.required]],
    });

    const formChangesSubscr = this.InterestForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.InterestForm.get('name')?.hasError('required') ||
      this.InterestForm.get('description')?.hasError('required') ||
      this.InterestForm.get('rateValue')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.InterestForm.patchValue(this.formValue)
  }

  get f() {
    return this.InterestForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.InterestForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.InterestForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.InterestForm.controls[controlName];
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
