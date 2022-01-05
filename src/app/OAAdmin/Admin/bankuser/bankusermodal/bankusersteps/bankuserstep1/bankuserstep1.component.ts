import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {corporateUser} from "../../../../../Model/OAAdmin/Request/corporateUser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {bankuser} from "../../../../../Model/OAAdmin/Request/bankuser";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {oaCommonService} from "../../../../../shared/oacommon.service";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {BankusermodalComponent} from "../../bankusermodal.component";
import {ReterivecustomersmodalComponent} from "../../../../common/reterivecustomersmodal/reterivecustomersmodal.component";
import {ccorporates} from "../../../../../Model/OAAdmin/cRequest/ccorporates";


@Component({
  selector: 'app-bankuserstep1',
  templateUrl: './bankuserstep1.component.html',
  styleUrls: ['./bankuserstep1.component.scss']
})
export class Bankuserstep1Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (part: Partial<bankuser>, isFormValid: boolean) => void;
  @Input() defaultValues: Partial<bankuser>;
  private unsubscribe: Subscription[] = [];
  bankUserForm: FormGroup;
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
  ccorporates: ccorporates

  constructor(private fb: FormBuilder,
              public oaCommonService: oaCommonService,
              public modalService: NgbModal) {

  }

  ngOnInit() {
    this.ccorporates = new ccorporates();
    this.initForm();
    if (this.mode === 'new') {
      this.oaCommonService.getReferenceNumber('bankusers').subscribe((res) => {
        this.f.userId.setValue(res);
      });
      // this.roles = [
      //   { name: "BANK_ADMIN_MAKER" },
      //   { name: "BANK_ADMIN_CHECKER" },
      //   { name: "BANK_ADMIN_VIEWER" },
      // ];
      this.dropdownList = [
        {name: "BANK_USER_MAKER"},
        {name: "BANK_USER_CHECKER"},
        {name: "BANK_USER_VIEWER"}
      ];

    } else {
      this.updateForm();
      if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
        this.bankUserForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  get f() {
    return this.bankUserForm.controls;
  }

  updateForm() {
    this.bankUserForm.patchValue(this.formValue)
    this.dropdownList = this.formValue.roles
    const customerList = this.formValue.customers
    if(customerList.length > 0) {
      this.f.customerId.setValue(customerList[0].customerId)
    }
  }

  initForm() {
    this.bankUserForm = this.fb.group({
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

    const formChangesSubscr = this.bankUserForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());

  }
  isControlValid(controlName: string): boolean {
    const control = this.bankUserForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.bankUserForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.bankUserForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    return false;
  }

  checkForm() {
    return !(
      this.bankUserForm.get('userId')?.hasError('required') ||
      this.bankUserForm.get('firstName')?.hasError('required') ||
      this.bankUserForm.get('lastName')?.hasError('required') ||
      this.bankUserForm.get('emailAddress')?.hasError('required') ||
      this.bankUserForm.get('emailAddress')?.hasError('email')
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

  changeCustomerId()
  {
    this.ccorporates.customerId = this.bankUserForm.value.customerId
    this.f.customers.setValue([this.ccorporates])
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
