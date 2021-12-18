import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {SbrmodalComponent} from "../../../../common/sbrmodal/sbrmodal.component";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {financing} from "../../../../../Model/OAPF/Request/financing";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Corporateuser} from "../../../../../Model/corporateuser";
import {Subscription} from "rxjs";
import {invoiceService} from "../../../../../shared/OAPF/invoice.service";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-financingstep1',
  templateUrl: './financingstep1.component.html',
  styleUrls: ['./financingstep1.component.scss']
})
export class Financingstep1Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (part: Partial<financing>,isFormValid: boolean) => void;
  @Input() mode :  any;
  @Input('formValue') formValue :  any;
  @Input() defaultValues: Partial<financing>;
  public currencyList:any = currencyList;
  financingForm: FormGroup
  modalOption: NgbModalOptions = {};
  private unsubscribe: Subscription[] = [];

  //Invoices
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<Corporateuser>();
  private subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['checked','invoiceNumber', 'currency', 'amount', 'dueDate', 'status' ,'actions'];
  invoiceList: FormArray = this.fb.array([]);
  //checkbox
  selection = new SelectionModel<Element>(true, []);
  invoiceSelected = false

  constructor(public modalService: NgbModal,private fb: FormBuilder,public invoiceServices: invoiceService) { }

  ngOnInit(): void {
    this.initForm()
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.financingForm.disable()
    }
    if(this.mode !== 'new') {
      this.f.financeId.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  checkForm() {
    return !(
      this.financingForm.get('financeId')?.hasError('required')
    );
  }

  initForm(){
    this.financingForm = this.fb.group({
      financeId: [this.defaultValues.financeId,[Validators.required]],
      sbrReferenceId: [this.defaultValues.sbrReferenceId,[Validators.required]],
      agreementId: [this.defaultValues.agreementId,[Validators.required]],
      buyerId: [this.defaultValues.buyerId,[Validators.required]],
      sellerId: [this.defaultValues.sellerId,[Validators.required]],
      buyerName: [this.defaultValues.buyerName,[Validators.required]],
      sellerName: [this.defaultValues.sellerName,[Validators.required]],
      financingType: [this.defaultValues.financingType,[Validators.required]],
      businessType: [this.defaultValues.businessType,[Validators.required]],
      financeDueDate: ['',[Validators.required]],
      invoiceList: this.invoiceList
    });

    const formChangesSubscr = this.financingForm.valueChanges.subscribe((val) => {
      let formE = document.getElementById('financingForm');
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);

  }

  updateForm() {
    this.financingForm.patchValue(this.formValue)
  }

  isControlValid(controlName: string): boolean {
    const control = this.financingForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.financingForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.financingForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.form.controls[controlName];
    return false;
  }

  openSBRDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SbrmodalComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.financingForm.patchValue(result)
      this.f.sbrReferenceId.setValue(result.sbrId)
      this.f.agreementId.setValue(result.agreement['contractReferenceNumber'])

      let cAgreement = result.agreement
      let cBusinsessType = cAgreement['businessType']
      let cBusinessTypeName = cBusinsessType['name']
      this.f.businessType.setValue(cBusinessTypeName)

      this.f.buyerId.setValue(result.anchorCustomer['customerId'])
      this.f.buyerName.setValue(result.anchorCustomer['name'])

      let cCustomerId = result.counterParty['customerId']
      console.log(cCustomerId)
      this.f.sellerId.setValue(cCustomerId)
      let cCustomerName = result.counterParty['name']
      this.f.sellerName.setValue(cCustomerName)
      this.f.financingType.setValue('INVOICE_FINANCING')
      console.log('result is ' + result);
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }

  get f() {
    return this.financingForm.controls;
  }

  public getInvoicesDate() {
    console.log('Get Invoices')
    console.log()
    const sb = this.invoiceServices.getInvoice(this.financingForm.value.financeDueDate, '', 'loanDueDate').subscribe((res) => {


      for (let i = 0; i < res.length; i++) {
        console.log(res[i].invoiceNumber)
        const inv = this.fb.group({
          invoiceNumber: [res[i].invoiceNumber, '']
        });
        this.invoiceList.push(inv)
      }
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    console.log("Form is "+this.financingForm)
    this.subscriptions.push(sb);
  }

  get array(): FormArray {
    return this.financingForm.get('invoiceList') as FormArray;
  }

  //
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: Element) => this.selection.select(row));
  }

  openInvoiceDelete(element: any) {
    const index = this.dataSource.data.indexOf(element.id);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.invoiceList.clear()
    const res = this.dataSource.data
    for (let i = 0; i < res.length; i++) {
      console.log(res[i].invoiceNumber)
      const inv = this.fb.group({
        invoiceNumber: [res[i].invoiceNumber, '']
      });
      this.invoiceList.push(inv)
    }
    console.log(this.financingForm)
  }
}
