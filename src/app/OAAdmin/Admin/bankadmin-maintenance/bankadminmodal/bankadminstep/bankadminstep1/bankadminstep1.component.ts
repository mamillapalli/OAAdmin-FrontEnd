import {Component, NgModule, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {BankAdmin} from "../../../../../Model/OAAdmin/Request/bankadmin";
import {oaCommonService} from "../../../../../shared/oacommon.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";

@Component({
  selector: 'app-bankadminstep1',
  templateUrl: './bankadminstep1.component.html',
  styleUrls: ['./bankadminstep1.component.scss']
})
export class Bankadminstep1Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (part: Partial<BankAdmin>, isFormValid: boolean) => void;
  @Input() defaultValues: Partial<BankAdmin>;
  private unsubscribe: Subscription[] = [];
  bankAdminForm: FormGroup;
  @Input() mode: any;
  @Input('formValue') formValue: any;
  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  selectedItems: any = [];
  rolesList: any = ['BANK_ADMIN_MAKER','BANK_ADMIN_CHECKER','BANK_ADMIN_VIEWER'];

  constructor(private fb: FormBuilder, public oaCommonService: oaCommonService) {

  }

  ngOnInit() {
    this.initForm();
    if (this.mode === 'new') {
      this.oaCommonService.getReferenceNumber('bankadmins').subscribe((res) => {
        this.f.userId.setValue(res);
      });
      // this.roles = [
      //   { name: "BANK_ADMIN_MAKER" },
      //   { name: "BANK_ADMIN_CHECKER" },
      //   { name: "BANK_ADMIN_VIEWER" },
      // ];
      this.dropdownList = [
        {name: "BANK_ADMIN_MAKER"},
        {name: "BANK_ADMIN_CHECKER"},
        {name: "BANK_ADMIN_VIEWER"}
      ];

    } else {
      this.updateForm();
      if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
        this.bankAdminForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  get f() {
    return this.bankAdminForm.controls;
  }

  updateForm() {
    this.bankAdminForm.patchValue(this.formValue)
    this.dropdownList = this.formValue.roles
  }

  initForm() {
    this.bankAdminForm = this.fb.group({
      userId: [this.defaultValues.userId, [Validators.required]],
      firstName: [this.defaultValues.firstName, [Validators.required]],
      lastName: [this.defaultValues.lastName, [Validators.required]],
      effectiveDate: [this.defaultValues.effectiveDate, [Validators.required]],
      expiryDate: [this.defaultValues.expiryDate, [Validators.required]],
      emailAddress: [this.defaultValues.emailAddress, [Validators.required]],
      roles: [this.defaultValues.roles, [Validators.required]],
    });

    const formChangesSubscr = this.bankAdminForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.bankAdminForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.bankAdminForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.bankAdminForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    return false;
  }

  checkForm() {
    return !(
      this.bankAdminForm.get('userId')?.hasError('required') ||
      this.bankAdminForm.get('firstName')?.hasError('required') ||
      this.bankAdminForm.get('lastName')?.hasError('required') ||
      this.bankAdminForm.get('emailAddress')?.hasError('required') ||
      this.bankAdminForm.get('emailAddress')?.hasError('email')
    );
  }

}
