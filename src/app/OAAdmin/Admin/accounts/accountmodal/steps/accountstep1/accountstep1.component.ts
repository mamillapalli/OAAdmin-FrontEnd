import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../../../Model/OAAdmin/Request/corporateUser";
import {Customer} from "../../../../../Model/customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {Accounts} from "../../../../../Model/OAAdmin/Request/accounts";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {ReterivecustomersmodalComponent} from "../../../../common/reterivecustomersmodal/reterivecustomersmodal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {oaCommonService} from '../../../../../shared/oacommon.service'

@Component({
  selector: 'app-accountstep1',
  templateUrl: './accountstep1.component.html',
  styleUrls: ['./accountstep1.component.scss']
})
export class Accountstep1Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<Accounts>,
    isFormValid: boolean
  ) => void;
  accountsForm: FormGroup;
  @Input() defaultValues: Partial<Accounts>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  displayedColumns: string[] = ['customerId', 'name', 'emailAddress', 'effectiveDate', 'expiryDate', 'actions'];
  clickedRows = new Set<Customer>();
  public currencyList:any = currencyList;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,public oaCommonService: oaCommonService) { }
  isFinanceFetched = false;
  customers: FormArray = this.fb.array([]);

  ngOnInit(): void {
    this.initForm();
    if (this.mode === 'new') {
      this.oaCommonService.getReferenceNumber('accounts').subscribe((res) => {
        this.f.accountId.setValue(res);
      });
    } else {
      this.updateForm();
      if (this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view') {
        this.accountsForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.accountsForm = this.fb.group({
      accountId: [this.defaultValues.accountId,[Validators.required]],
      name: [this.defaultValues.name,[Validators.required]],
      type: [this.defaultValues.type,[Validators.required]],
      currency: [this.defaultValues.currency,[Validators.required]],
      description: [this.defaultValues.description,[Validators.required]],
      debitCreditFlag: [this.defaultValues.debitCreditFlag,[Validators.required]],
    });

    const formChangesSubscr = this.accountsForm.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.accountsForm.get('accountId')?.hasError('required') ||
      this.accountsForm.get('name')?.hasError('required') ||
      this.accountsForm.get('type')?.hasError('required') ||
      this.accountsForm.get('description')?.hasError('required') ||
      this.accountsForm.get('currency')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.accountId.setValue(this.formValue.accountId);
    this.f.name.setValue(this.formValue.name);
    this.f.type.setValue(this.formValue.type);
    this.f.description.setValue(this.formValue.description);
    this.f.currency.setValue(this.formValue.currency);
    this.accountsForm.patchValue(this.formValue)
  }

  get f() {
    return this.accountsForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.accountsForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.accountsForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.accountsForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.form.controls[controlName];
    return false;
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: { firstName: string; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
    }
    return filterFunction;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCustomerDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(ReterivecustomersmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      const idx: number = this.dataSource.data.findIndex((obj: { customerId: any; }) => obj.customerId === result.customerId);
      console.log('idx----------------->' + idx)
      if (idx === -1) {
        this.dataSource.data.push(result);
        const cust = this.fb.group({
          customerId: [result.customerId, '']
        });
        this.customers.push(cust)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isFinanceFetched = true
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.isFinanceFetched = false
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


  get array(): FormArray {
    return this.accountsForm.get('customers') as FormArray;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }
}
