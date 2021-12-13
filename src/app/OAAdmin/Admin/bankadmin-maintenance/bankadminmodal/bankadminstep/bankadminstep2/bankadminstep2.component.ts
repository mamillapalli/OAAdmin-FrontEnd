import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {BankAdmin} from "../../../../../model/bankadmin";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-bankadminstep2',
  templateUrl: './bankadminstep2.component.html',
  styleUrls: ['./bankadminstep2.component.scss']
})
export class Bankadminstep2Component implements OnInit {
  dropdownList : any = [];
  dropdownSettings:IDropdownSettings={};
  selectedItems: any =[];
  roles = [
    { name: "BANK_ADMIN_MAKER" },
    { name: "BANK_ADMIN_CHECKER" },
    { name: "BANK_ADMIN_VIEWER" },
  ];

  selected = [{ name: "BANK_ADMIN_MAKER" },{ name: "BANK_ADMIN_VIEWER" },{ name: "BANK_ADMIN_CHECKER" }];


  user: any = {};
  placement = 'right';
  @Input('updateParentModel') updateParentModel: (
    part: Partial<BankAdmin>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<BankAdmin>;

  private unsubscribe: Subscription[] = [];

  @Input('formValue') formValue :  any;
  @Input() mode :  any;

  constructor(private fb: FormBuilder,private datePipe: DatePipe) {}

  yourForm: any = {
    date: this.datePipe.transform(new Date(1999, 6, 15), "yyyy-MM-dd")
  }

  ngOnInit() {
    this.dropdownList = [
      { name: 'BANK_ADMIN_MAKER' },
      { name: 'BANK_ADMIN_VIEWER' },
      { name: 'BANK_ADMIN_CHECKER' },
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
      effectiveDate: [Validators.required],
      expiryDate: [Validators.required],
      status: [],
      roles: [],
      //rolesName: [this.defaultValues.roles,[Validators.required]],
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

  updateForm()
  {
    //const date =  this.datePipe.transform(new Date(this.formValue.effectiveDate), "dd/MM/yyyy")
    this.user.effectiveDate = this.datePipe.transform(new Date(this.formValue.effectiveDate), "dd/MM/yyyy");
    this.f.effectiveDate.setValue(this.user.effectiveDate);
    this.user.expiryDate = this.datePipe.transform(new Date(this.formValue.expiryDate), "dd/MM/yyyy");
    this.f.expiryDate.setValue(this.user.expiryDate );
    this.f.status.setValue(this.formValue.status);

    this.selectedItems = [
      { name : this.formValue.roles  }
    ];
    this.f.roles.setValue([this.selectedItems])
    console.log(this.formValue.status)

    //this.f.rolesName.setValue(this.formValue.rolesName);
  }

  get f() {
    return this.form.controls;
  }

}
