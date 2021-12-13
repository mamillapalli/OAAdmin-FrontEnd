  import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbCalendar, NgbDatepicker, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {DatePipe, formatDate} from "@angular/common";
import {Corporateuser} from "../../../../../Model/corporateuser";

@Component({
  providers:[DatePipe],
  selector: 'app-corporateuserstep2',
  templateUrl: './corporateuserstep2.component.html',
  styleUrls: ['./corporateuserstep2.component.scss',
  ]
})
export class Corporateuserstep2Component implements OnInit {
  today: Date;
  fromDate: any; toDate: any;
  effectiveDate: any
  expiryDate: any
  model:any;
  dropdownList : any = [];
  dropdownSettings:IDropdownSettings={};
  selectedItems: any =[];
  roles = [
    { name: "CORPORATE_USER_MAKER" },
    { name: "CORPORATE_USER_CHECKER" },
    { name: "CORPORATE_USER_VIEWER" },
  ];
  selected = [{ name: "CORPORATE_USER_MAKER" },{ name: "CORPORATE_USER_CHECKER" },{ name: "CORPORATE_USER_VIEWER" }];
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

  navigateEvent(event: { next: { year: number; month: number; }; }) {
    this.date = event.next;
  }

  ngOnInit() {
    this.dropdownList = [
      { name: "CORPORATE_USER_MAKER" },
      { name: "CORPORATE_USER_CHECKER" },
      { name: "CORPORATE_USER_VIEWER" },
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
    // console.log(exDate)
    // this.expiryDate = exDate
    // console.log(this.f.expiryDate);
    // console.log(this.f.effectiveDate);
    this.f.status.setValue(this.formValue.status);
    this.selectedItems = [
      { name : this.formValue.roles  }
    ];
    this.f.roles.setValue([this.selectedItems])

    // this.user.effectiveDate = this.datePipe.transform(new Date(this.formValue.effectiveDate), "dd/MM/yyyy");
    // this.f.effectiveDate.setValue(this.user.effectiveDate);
    // this.user.expiryDate = this.datePipe.transform(new Date(this.formValue.expiryDate), "dd/MM/yyyy");
    // this.f.expiryDate.setValue(this.user.expiryDate );


    // this.user.effectiveDate = formatDate(this.formValue.effectiveDate, 'dd/MM/yyyy', 'en')
    //
    // console.log(formatDate(this.formValue.expiryDate, 'dd/MM/yyyy', 'en'))
    //
    // console.log(this.datePipe.transform(new Date(this.formValue.expiryDate), "dd/MM/yyyy"))


  }

  get f() {
    return this.form.controls;
  }
}
