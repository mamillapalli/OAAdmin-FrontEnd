import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subscription, throwError} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {Customer} from "../../../../../Model/customer";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../../../../modules/auth";
import {catchError, retry} from "rxjs/operators";
import {corporateUser} from "../../../../../Model/OAAdmin/Request/corporateUser";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ReterivecustomersmodalComponent} from "../../../../common/reterivecustomersmodal/reterivecustomersmodal.component";
import { oaCommonService} from "../../../../../shared/oacommon.service";

@Component({
  selector: 'app-corporateuserstep1',
  templateUrl: './corporateuserstep1.component.html',
  styleUrls: ['./corporateuserstep1.component.scss']
})
export class Corporateuserstep1Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (part: Partial<corporateUser>, isFormValid: boolean) => void;
  @Input() defaultValues: Partial<corporateUser>;
  private unsubscribe: Subscription[] = [];
  corporateAdminForm: FormGroup;
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
  modalOption: NgbModalOptions = {}; // not null!
  private closeResult: string;

  constructor(private fb: FormBuilder,
              public oaCommonService: oaCommonService,
              public modalService: NgbModal) {

  }

  ngOnInit() {
    this.initForm();
    if (this.mode === 'new') {
      this.oaCommonService.getReferenceNumber('customeradmins').subscribe((res) => {
        this.f.userId.setValue(res);
      });
      // this.roles = [
      //   { name: "BANK_ADMIN_MAKER" },
      //   { name: "BANK_ADMIN_CHECKER" },
      //   { name: "BANK_ADMIN_VIEWER" },
      // ];
      this.dropdownList = [
        {name: "CORPORATE_USER_MAKER"},
        {name: "CORPORATE_USER_CHECKER"},
        {name: "CORPORATE_USER_VIEWER"}
      ];

    } else {
      this.updateForm();
      if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
        this.corporateAdminForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  get f() {
    return this.corporateAdminForm.controls;
  }

  updateForm() {
    this.corporateAdminForm.patchValue(this.formValue)
    this.dropdownList = this.formValue.roles
    const customerList = this.formValue.customers
    this.f.customerId.setValue(customerList[0].customerId)
  }

  initForm() {
    this.corporateAdminForm = this.fb.group({
      userId: [this.defaultValues.userId, [Validators.required]],
      firstName: [this.defaultValues.firstName, [Validators.required]],
      lastName: [this.defaultValues.lastName, [Validators.required]],
      effectiveDate: [this.defaultValues.effectiveDate, [Validators.required]],
      expiryDate: [this.defaultValues.expiryDate, [Validators.required]],
      emailAddress: [this.defaultValues.emailAddress, [Validators.required]],
      roles: [this.defaultValues.roles, [Validators.required]],
      customerId:[this.defaultValues.roles,[Validators.required]],
      customers:[[Validators.required]],
      status:[this.defaultValues.status,[Validators.required]]
    });

    const formChangesSubscr = this.corporateAdminForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.corporateAdminForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.corporateAdminForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.corporateAdminForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    return false;
  }

  checkForm() {
    return !(
      this.corporateAdminForm.get('userId')?.hasError('required') ||
      this.corporateAdminForm.get('firstName')?.hasError('required') ||
      this.corporateAdminForm.get('lastName')?.hasError('required') ||
      this.corporateAdminForm.get('emailAddress')?.hasError('required') ||
      this.corporateAdminForm.get('emailAddress')?.hasError('email')
    );
  }

  openCustomerDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(ReterivecustomersmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      this.f.customers.setValue([result])
      this.f.customerId.setValue(result.customerId)
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
