import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Corporates} from "../../../../../Model/corporates";

@Component({
  selector: 'app-corporatesstep2',
  templateUrl: './corporatesstep2.component.html',
  styleUrls: ['./corporatesstep2.component.scss']
})
export class Corporatesstep2Component implements OnInit {
  form: FormGroup;
  @Input() defaultValues: Partial<Corporates>;
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @Input('updateParentModel') updateParentModel: ( part: Partial<Corporates>, isFormValid: boolean) => void;
  private unsubscribe: Subscription[] = [];

  constructor(private fb: FormBuilder) {}

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
      vatRegistrationNumber: [this.defaultValues.vatRegistrationNumber],
      taxRegistrationNumber: [this.defaultValues.taxRegistrationNumber],
      directorName: [this.defaultValues.directorName],
      directorDetails: [this.defaultValues.directorDetails],
      sponsorName: [this.defaultValues.sponsorName],
      sponsorDetails: [this.defaultValues.sponsorDetails],
      status: [this.defaultValues.status],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('status')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.vatRegistrationNumber.setValue(this.formValue.vatRegistrationNumber);
    this.f.taxRegistrationNumber.setValue(this.formValue.taxRegistrationNumber);
    this.f.directorName.setValue(this.formValue.directorName);
    this.f.directorDetails.setValue(this.formValue.directorDetails);
    this.f.sponsorName.setValue(this.formValue.sponsorName);
    this.f.sponsorDetails.setValue(this.formValue.sponsorDetails);
    this.f.status.setValue(this.formValue.status);
  }

  get f() {
    return this.form.controls;
  }

}
