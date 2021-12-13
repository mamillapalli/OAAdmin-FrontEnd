import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Corporates} from "../../../../../Model/corporates";
import {Subscription} from "rxjs";
import { countries } from '../../../../../model/country-data-store';

@Component({
  selector: 'app-corporatesstep1',
  templateUrl: './corporatesstep1.component.html',
  styleUrls: ['./corporatesstep1.component.scss']
})
export class Corporatesstep1Component implements OnInit {

  form: FormGroup;
  @Input('updateParentModel') updateParentModel: (part: Partial<Corporates>,isFormValid: boolean) => void;
  @Input() defaultValues: Partial<Corporates>;
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  private unsubscribe: Subscription[] = [];
  public countries:any = countries;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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
      customerId: [this.defaultValues.customerId,[Validators.required]],
      name: [this.defaultValues.name,[Validators.required]],
      addressLine1: [this.defaultValues.addressLine1,[Validators.required]],
      addressLine2: [this.defaultValues.addressLine1,[Validators.required]],
      addressLine3: [this.defaultValues.addressLine1,[Validators.required]],
      poBox: [this.defaultValues.poBox,[Validators.required]],
      country: [this.defaultValues.country,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required, Validators.email]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('customerId')?.hasError('required') ||
      this.form.get('name')?.hasError('required') ||
      this.form.get('addressLine1')?.hasError('required') ||
      this.form.get('addressLine2')?.hasError('required') ||
      this.form.get('addressLine3')?.hasError('required') ||
      this.form.get('poBox')?.hasError('poBox') ||
      this.form.get('country')?.hasError('country') ||
      this.form.get('emailAddress')?.hasError('email')
    );
  }

  updateForm()
  {
    console.log(this.formValue)
    this.f.customerId.setValue(this.formValue.customerId);
    this.f.name.setValue(this.formValue.name);
    this.f.addressLine1.setValue(this.formValue.addressLine1);
    this.f.addressLine2.setValue(this.formValue.addressLine2);
    this.f.addressLine3.setValue(this.formValue.addressLine3);
    this.f.emailAddress.setValue(this.formValue.emailAddress);
    this.f.poBox.setValue(this.formValue.poBox);
    this.f.country.setValue(this.titleCaseWord(this.formValue.country));
  }

  get f() {
    return this.form.controls;
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}
