import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {Corporateuser} from "../../../../../Model/corporateuser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbCalendar, NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-bankuserstep2',
  templateUrl: './bankuserstep2.component.html',
  styleUrls: ['./bankuserstep2.component.scss']
})
export class Bankuserstep2Component implements OnInit {

  today: Date;
  fromDate: any; toDate: any;
  effectiveDate: any
  expiryDate: any
  model:any;
  dropdownList : any = [];
  dropdownSettings:IDropdownSettings={};
  selectedItems: any =[];
  user: any = {};
  placement = 'right';
  @Input('updateParentModel') updateParentModel: (part: Partial<Corporateuser>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Corporateuser>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;

  date: {
    year: number,
    month: number
  };
  @ViewChild('dp') dp: NgbDatepicker;

  constructor(private fb: FormBuilder,private datePipe: DatePipe,private calendar: NgbCalendar) {
    this.today =new Date();
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  setCurrent() {
    //Current Date
    this.dp.navigateTo()
  }
  setDate() {
    //Set specific date
    this.dp.navigateTo({
      year: 2013,
      month: 2
    });
  }

  ngOnInit() {
    this.dropdownList = [
      { name: "BANK_USER_MAKER" },
      { name: "BANK_USER_CHECKER" },
      { name: "BANK_USER_VIEWER" },
    ];
    this.dropdownSettings = {
      idField: 'name',
      textField: 'name',
    };

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
      effectiveDate: ['',Validators.required],
      expiryDate: ['',Validators.required],
      status: [],
      roles: [],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('effectiveDate')?.hasError('required') ||
      this.form.get('expiryDate')?.hasError('required')
      //|| this.form.get('rolesName')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString().substring(0,10);
  }

  updateForm()
  {
    const efDate = this.datePipe.transform(new Date(this.formValue.effectiveDate), "yyyy-MM-dd")
    console.log(efDate)
    this.f.effectiveDate.setValue(efDate)
    // this.effectiveDate = efDate
    const exDate = this.datePipe.transform(new Date(this.formValue.expiryDate), "yyyy-MM-dd")
    this.f.expiryDate.setValue(exDate)
    this.f.status.setValue(this.formValue.status);
    this.selectedItems = [
      { name : this.formValue.roles  }
    ];
    this.f.roles.setValue([this.selectedItems])
  }

  get f() {
    return this.form.controls;
  }

}
