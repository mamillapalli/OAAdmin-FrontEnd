import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {superAdmin} from "../../../../../Model/super-admin";


@Component({
  selector: 'app-adminstep3',
  templateUrl: './adminstep3.component.html',
})
export class AdminStep3Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<superAdmin>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<superAdmin>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;

  constructor(private fb: FormBuilder) {}

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
      userId: [this.defaultValues.userId,[Validators.required]],
      firstName: [this.defaultValues.firstName,[Validators.required]],
      lastName: [this.defaultValues.lastName,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required, Validators.email]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('userId')?.hasError('required') ||
      this.form.get('firstName')?.hasError('required') ||
      this.form.get('lastName')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('email')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.userId.setValue(this.formValue.userId);
    this.f.firstName.setValue(this.formValue.firstName);
    this.f.lastName.setValue(this.formValue.lastName);
    this.f.emailAddress.setValue(this.formValue.emailAddress);

  }

  get f() {
    return this.form.controls;
  }
}
