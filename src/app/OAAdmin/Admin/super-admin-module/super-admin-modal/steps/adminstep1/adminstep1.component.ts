import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {superAdmin} from "../../../../../Model/super-admin";
import { oaCommonService} from "../../../../../shared/oacommon.service";


@Component({
  selector: 'app-adminstep1',
  templateUrl: './adminstep1.component.html',
})
export class AdminStep1Component implements OnInit, OnDestroy {
  @Input('updateParentModel') updateParentModel: ( part: Partial<superAdmin>, isFormValid: boolean ) => void;
  @Input() defaultValues: Partial<superAdmin>;
  private unsubscribe: Subscription[] = [];
  superAdminForm: FormGroup;
  @Input() mode: any;
  @Input('formValue') formValue :  any;

  constructor(private fb: FormBuilder,public oaCommonService: oaCommonService) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'new')
    {
      this.oaCommonService.getReferenceNumber('superadmins').subscribe((res) => {
        this.f.userId.setValue(res);
      });
    } else {
      this.updateForm();
      if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
      {
        this.superAdminForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  get f() {
    return this.superAdminForm.controls;
  }

  updateForm()
  {
    this.superAdminForm.patchValue(this.formValue)
  }

  initForm() {
    this.superAdminForm = this.fb.group({
      userId: [this.defaultValues.userId, [Validators.required]],
      firstName: [this.defaultValues.firstName, [Validators.required]],
      lastName: [this.defaultValues.lastName, [Validators.required]],
      effectiveDate: [this.defaultValues.effectiveDate, [Validators.required]],
      expiryDate: [this.defaultValues.expiryDate, [Validators.required]],
      emailAddress: [this.defaultValues.emailAddress, [Validators.required]],
      staus: [this.defaultValues.status, [Validators.required]],
    });

    const formChangesSubscr = this.superAdminForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.superAdminForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.superAdminForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.superAdminForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    return false;
  }

  checkForm() {
    return !(
      this.superAdminForm.get('userId')?.hasError('required') ||
      this.superAdminForm.get('firstName')?.hasError('required') ||
      this.superAdminForm.get('lastName')?.hasError('required') ||
      this.superAdminForm.get('emailAddress')?.hasError('required') ||
      this.superAdminForm.get('emailAddress')?.hasError('email')
    );
  }
}
