import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {corporateadmin} from "../../../../../Model/OAAdmin/Request/corporateadmin";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import {ReterivecustomersmodalComponent} from "../../../../common/reterivecustomersmodal/reterivecustomersmodal.component";
import {oaCommonService} from "../../../../../shared/oacommon.service";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-corporateadminstep1',
  templateUrl: './corporateadminstep1.component.html',
  styleUrls: ['./corporateadminstep1.component.scss']
})
export class Corporateadminstep1Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (part: Partial<corporateadmin>, isFormValid: boolean) => void;
  @Input() defaultValues: Partial<corporateadmin>;
  private unsubscribe: Subscription[] = [];
  corporateAdminForm: FormGroup;
  @Input() mode: any;
  @Input('formValue') formValue: any;
  selectedItems: any = [];
  dropdownList:any = []
  dropdownSettings = {
    singleSelection: false,
    text: "Select Roles",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: "myclass custom-class",
    autoPosition: true,
    badgeShowLimit: 3,
    lazyLoading: true,
    showCheckbox: true,
    maxHeight: 120

  };
  rolesList: any = ['CORPORATE_ADMIN_MAKER', 'CORPORATE_ADMIN_CHECKER', 'CORPORATE_ADMIN_VIEWER'];

  modalOption: NgbModalOptions = {}; // not null!
  private closeResult: string;
  ReadOnlyCheckBox: boolean

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
      this.dropdownList = [
        {"id": 0, "itemName": "Corporate Admin Maker", "name": "CORPORATE_ADMIN_MAKER"},
        {"id": 1, "itemName": "Corporate Admin Checker", "name": "CORPORATE_ADMIN_CHECKER"},
        {"id": 2, "itemName": "Corporate Admin Viewer", "name": "CORPORATE_ADMIN_VIEWER"}
      ]

    } else {
      this.updateForm();
      if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
        this.corporateAdminForm.disable()
        this.ReadOnlyCheckBox = true;
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  get f() {
    return this.corporateAdminForm.controls;
  }

  updateForm() {
    this.corporateAdminForm.patchValue(this.formValue)
    let va = this.formValue.roles
    console.log('va'+va[0].name)
    console.log('va'+va.length)
    for (let i = 0; i < va.length; i++) {
      var tempObj = {"id": 0, "itemName": "", "name": ""};
      tempObj.id = i;
      tempObj.itemName = va[i].name.replace('_',' ').replace('_', '').toLowerCase();
      tempObj.name = va[i].name;
      console.log(tempObj)
      this.selectedItems.push(tempObj);
      this.dropdownList.push(tempObj);
    }
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
  onItemSelect(item
                 :
                 any
  ) {
    console.log(item);
  }

  OnItemDeSelect(item
                   :
                   any
  ) {
    console.log(item);
  }

  onSelectAll(items
                :
                any
  ) {
    console.log(items);
  }

  onDeSelectAll(items
                  :
                  any
  ) {
    console.log(items);
  }
}
