import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {SbrdatamodalComponent} from "../../../../common/sbrdatamodal/sbrdatamodal.component";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {financing} from "../../../../../Model/OAPF/Request/financing";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../../../Model/OAAdmin/Request/corporateUser";
import {Subscription} from "rxjs";
import {invoiceService} from "../../../../../shared/OAPF/invoice.service";
import {SelectionModel} from "@angular/cdk/collections";
import {oapfcommonService} from "../../../../../shared/oapfcommon.service";
import {NgxSpinnerService} from "ngx-spinner";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

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
  dataSource: any = new MatTableDataSource<corporateUser>();
  private subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['invoiceNumber', 'currency', 'amount', 'dueDate', 'status' , 'transactionStatus' ,'actions'];
  invoiceList: FormArray = this.fb.array([]);
  //checkbox
  selection = new SelectionModel<Element>(true, []);
  invoiceSelected = false
  isDataSource = false

  //sort
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  constructor(public modalService: NgbModal,
              private fb: FormBuilder,
              public invoiceServices: invoiceService,
              public oapfcommonService: oapfcommonService,
              private spinner: NgxSpinnerService) {

}

  ngOnInit(): void {
    console.log(`Bearer $this.mode`)
    this.initForm()

    if(this.mode === 'new')
    {
      this.f.financeId.disabled
      this.oapfcommonService.getReferenceNumber('finances').subscribe((res) => {
        this.f.financeId.setValue(res);
      });
    } else {
      this.f.financeId.disabled
      this.updateForm();
      if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
      {
        this.financingForm.disable()
      }
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
      financeDueDate: [this.defaultValues.financeDueDate,[Validators.required]],
      invoiceList: [this.defaultValues.invoiceList,[]],
      invoiceSelected : [this.defaultValues.invoiceSelected,[]],
      isDataSource: [this.defaultValues.isDataSource,[]]
    });

    if(this.defaultValues.invoiceSelected) {
      let c:any = this.defaultValues.invoiceList;
      if(c.length > 0 ) {
        this.dataSource.data = this.defaultValues.invoiceList;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.invoiceSelected = true;
      }
    }

    const formChangesSubscr = this.financingForm.valueChanges.subscribe((val) => {
      let formE = document.getElementById('financingForm');
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);

  }

  updateForm() {
    this.financingForm.patchValue(this.formValue)
    console.log('Invoice List '+this.formValue.invoiceList)
    if(this.formValue.invoiceList.length > 0)
    {
      this.invoiceSelected = true;
      this.dataSource.data = this.formValue.invoiceList;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
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
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(SbrdatamodalComponent, this.modalOption);
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
    this.spinner.show();
    //const sb = this.invoiceServices.getInvoice(this.financingForm.value.financeDueDate, '', 'loanDueDate').subscribe((res) => {
    const sb = this.oapfcommonService.getDataWithPaginationLoanMultiple('/oapf/api/v1/invoices/',this.currentPage,this.pageSize,this.sortData,this.financingForm.value.financeDueDate,this.financingForm.value.sbrReferenceId).subscribe((res) => {
      console.log(res.content)
      if(res.content.length > 0) {
        for (let i = 0; i < res.content.length; i++) {
          console.log(res.content[i].invoiceNumber)
          const inv = this.fb.group({
            invoiceNumber: [res.content[i].invoiceNumber, '']
          });
          this.invoiceList.push(inv)
        }

        this.dataSource.data = res.content;
        this.f.invoiceList.patchValue(this.dataSource.data)
        this.totalRows = res.totalElements;
        this.invoiceSelected = true
        this.isDataSource = false
        this.f.invoiceSelected.setValue(true)
        this.f.isDataSource.setValue(false)
      } else {
        this.isDataSource = true
        this.invoiceSelected = false
        this.f.invoiceSelected.setValue(false)
        this.f.isDataSource.setValue(true)
      }
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
    console.log('Delete Invoice Id is '+element.invoiceNumber)
    const index = this.dataSource.data.indexOf(element.invoiceNumber);
    //const user = this.dataSource.data.findIndex((x: { invoiceId: string; }) => x.invoiceId === element.id)
    const idx: number = this.dataSource.data.findIndex((obj: { invoiceNumber: any; }) => obj.invoiceNumber === element.invoiceNumber);
    console.log(idx)
    console.log(index)
    this.dataSource.data.splice(idx, 1);
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
    this.f.invoiceList.patchValue(this.dataSource.data)
    console.log(this.financingForm)
  }

  pageChanged(event: any) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInvoicesDate();
  }

  sortChanges(event: Sort) {
    this.sortData = event.active
    this.getInvoicesDate();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

}
