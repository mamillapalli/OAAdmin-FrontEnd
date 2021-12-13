import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {DatePipe} from "@angular/common";
import {superAdmin} from "../../../../../Model/super-admin";


@Component({
  selector: 'app-adminstep4',
  templateUrl: './adminstep4.component.html',
})
export class AdminStep4Component implements OnInit {
  user: any = {};
  placement = 'right';
  @Input('updateParentModel') updateParentModel: (
    part: Partial<superAdmin>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<superAdmin>;

  private unsubscribe: Subscription[] = [];

  @Input('formValue') formValue :  any;
  @Input() mode :  any;

  constructor(private fb: FormBuilder,private datePipe: DatePipe) {}

  yourForm: any = {
    date: this.datePipe.transform(new Date(1999, 6, 15), "yyyy-MM-dd")
  }

  ngOnInit() {
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
      effectiveDate: [this.defaultValues.effectiveDate,[Validators.required]],
      expiryDate: [this.defaultValues.expiryDate,[Validators.required]],
      status: [],
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
    console.log(this.formValue.status)

    //this.f.rolesName.setValue(this.formValue.rolesName);
  }

  get f() {
    return this.form.controls;
  }
}

