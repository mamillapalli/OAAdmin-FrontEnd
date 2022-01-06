import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {Subscription} from "rxjs";
import { countries } from '../../../../../Model/country-data-store';
import {corporates} from "../../../../../Model/OAAdmin/Request/corporates";
import {oaCommonService} from "../../../../../shared/oacommon.service";

@Component({
  selector: 'app-corporatesstep1',
  templateUrl: './corporatesstep1.component.html',
  styleUrls: ['./corporatesstep1.component.scss']
})
export class Corporatesstep1Component implements OnInit {

  corporatesform: FormGroup;
  @Input('updateParentModel') updateParentModel: (part: Partial<corporates>,isFormValid: boolean) => void;
  @Input() defaultValues: Partial<corporates>;
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  private unsubscribe: Subscription[] = [];
  public countries:any = countries;

  constructor(private fb: FormBuilder,public oaCommonService: oaCommonService,) { }

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'new') {
      this.oaCommonService.getReferenceNumber('customers').subscribe((res) => {
        this.f.customerId.setValue(res);
      });
    } else {
      this.updateForm();
      if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
      {
        this.corporatesform.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.corporatesform = this.fb.group({
      customerId: [this.defaultValues.customerId,[Validators.required]],
      name: [this.defaultValues.name,[Validators.required]],
      addressLine1: [this.defaultValues.addressLine1,[Validators.required]],
      addressLine2: [this.defaultValues.addressLine1,[Validators.required]],
      addressLine3: [this.defaultValues.addressLine1,[Validators.required]],
      poBox: [this.defaultValues.poBox,[Validators.required]],
      country: [this.defaultValues.country,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required, Validators.email]],
      vatRegistrationNumber: [this.defaultValues.vatRegistrationNumber],
      taxRegistrationNumber: [this.defaultValues.taxRegistrationNumber],
      directorName: [this.defaultValues.directorName],
      directorDetails: [this.defaultValues.directorDetails],
      sponsorName: [this.defaultValues.sponsorName],
      sponsorDetails: [this.defaultValues.sponsorDetails],
      status: [this.defaultValues.status],
      bank: [this.defaultValues.bank],
      effectiveDate: [this.defaultValues.effectiveDate,[Validators.required]],
      expiryDate: [this.defaultValues.expiryDate,[Validators.required]],
    });

    const formChangesSubscr = this.corporatesform.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.corporatesform.get('customerId')?.hasError('required') ||
      this.corporatesform.get('name')?.hasError('required') ||
      this.corporatesform.get('emailAddress')?.hasError('email') ||
      this.corporatesform.get('effectiveDate')?.hasError('required') ||
      this.corporatesform.get('expiryDate')?.hasError('required')
    );
  }

  updateForm()
  {
    this.corporatesform.patchValue(this.formValue)
  }

  get f() {
    return this.corporatesform.controls;
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  isControlValid(controlName: string): boolean {
    const control = this.corporatesform.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.corporatesform.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.corporatesform.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    return false;
  }

}
