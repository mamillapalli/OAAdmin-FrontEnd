import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/OAAdmin/Request/rm";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ReterivecustomersmodalComponent} from "../../../../common/reterivecustomersmodal/reterivecustomersmodal.component";
import {oaCommonService} from "../../../../../shared/oacommon.service";
import {MatTableDataSource} from "@angular/material/table";
import {corporates} from "../../../../../Model/OAAdmin/Request/corporates";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-relationshipmanagerstep1',
  templateUrl: './relationshipmanagerstep1.component.html',
  styleUrls: ['./relationshipmanagerstep1.component.scss']
})
export class Relationshipmanagerstep1Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (part: Partial<rm>, isFormValid: boolean) => void;
  @Input() defaultValues: Partial<rm>;
  private unsubscribe: Subscription[] = [];
  rmForm: FormGroup;
  @Input() mode: any;
  @Input('formValue') formValue: any;
  private closeResult: string;
  modalOption: NgbModalOptions = {};
  dataSource: any = new MatTableDataSource<corporates>();
  displayedColumns: string[] = ['customerId', 'name', 'emailAddress', 'effectiveDate', 'expiryDate', 'status' , 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  customers: FormArray = this.fb.array([]);

  constructor(private fb: FormBuilder,
              public oaCommonService: oaCommonService,
              public modalService: NgbModal) {
  }

  ngOnInit() {
    this.initForm();
    if (this.mode === 'new') {
      this.oaCommonService.getReferenceNumber('customeradmins').subscribe((res) => {
        this.f.rmId.setValue(res);
      });
    } else {
      this.updateForm();
      if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
        this.rmForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  get f() {
    return this.rmForm.controls;
  }

  initForm() {
    this.rmForm = this.fb.group({
      rmId: [this.defaultValues.rmId, [Validators.required]],
      firstName: [this.defaultValues.firstName, [Validators.required]],
      lastName: [this.defaultValues.lastName, [Validators.required]],
      effectiveDate: [this.defaultValues.effectiveDate, [Validators.required]],
      joiningDate: [this.defaultValues.joiningDate, [Validators.required]],
      expiryDate: [this.defaultValues.expiryDate, [Validators.required]],
      emailAddress: [this.defaultValues.emailAddress, [Validators.required]],
      customers: this.customers
    });
    const formChangesSubscr = this.rmForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, true);
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  updateForm() {
    this.rmForm.patchValue(this.formValue)
    console.log('Invoice List '+this.formValue.customers)
    if(this.formValue.customers.length > 0)
    {
      this.dataSource.data = this.formValue.customers;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  isControlValid(controlName: string): boolean {
    const control = this.rmForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.rmForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.rmForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    return false;
  }

  checkForm() {
    return !(
      this.rmForm.get('rmId')?.hasError('required') ||
      this.rmForm.get('firstName')?.hasError('required') ||
      this.rmForm.get('lastName')?.hasError('required') ||
      this.rmForm.get('emailAddress')?.hasError('required') ||
      this.rmForm.get('emailAddress')?.hasError('email')
    );
  }

  openCustomerDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(ReterivecustomersmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      const idx: number = this.dataSource.data.findIndex((obj: { customerId: any; }) => obj.customerId === result.customerId);
      console.log('idx----------------->'+idx)
      if(idx === -1) {
        this.dataSource.data.push(result);
        const cust = this.fb.group({
          customerId: [result.customerId, '']
        });
        this.customers.push(cust)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRMDelete(element: any) {
    const index = this.dataSource.data.indexOf(element.customerId);
    const idx: number = this.dataSource.data.findIndex((obj: { customerId: any; }) => obj.customerId === element.customerId);
    this.dataSource.data.splice(idx, 1);
    this.dataSource._updateChangeSubscription();
    this.customers.clear()
    const res = this.dataSource.data
    for (let i = 0; i < res.length; i++) {
      console.log(res[i].customers)
      const inv = this.fb.group({
        customers: [res[i].customerId, '']
      });
      this.customers.push(inv)
    }
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

  openRMDialog(element:any, edit: any) {

  }

  get array(): FormArray {
    return this.rmForm.get('customers') as FormArray;
  }
}
