import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Invoice} from "../../../../../../Model/OAPF/Request/invoice";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../../../../Model/OAAdmin/Request/corporateUser";
import {Customer} from "../../../../../../Model/customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {invoiceService} from "../../../../../../shared/OAPF/invoice.service";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {SbrdatamodalComponent} from "../../../../../common/sbrdatamodal/sbrdatamodal.component";

@Component({
  selector: 'app-seller-approval-invoice-step1',
  templateUrl: './seller-approval-invoice-step1.component.html',
  styleUrls: ['./seller-approval-invoice-step1.component.scss']
})
export class SellerApprovalInvoiceStep1Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Invoice>,
    isFormValid: boolean
  ) => void;
  invoiceForm: FormGroup;
  @Input() defaultValues: Partial<Invoice>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input('formElement') formElement :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  public displayedColumns: string[] = ['sbrId','anchorCustomer','counterParty','agreement'];
  clickedRows = new Set<Customer>();
  public currencyList:any = currencyList;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sbrData: any

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,private datePipe: DatePipe,public invoiceServices: invoiceService) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view' || this.mode === 'authBuyer')
    {
      this.invoiceForm.disable()
    }
    if(this.mode !== 'new') {
      this.f.invoiceNumber.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      invoiceNumber: [this.defaultValues.invoiceNumber, [Validators.required]],
      sbrReferenceId: [this.defaultValues.sbrReferenceId, [Validators.required]],
      agreementId: [this.defaultValues.agreementId, [Validators.required]],
      anchorId: [this.defaultValues.anchorId, [Validators.required]],
      counterPartyId: [this.defaultValues.counterPartyId, [Validators.required]],
      documentType: [this.defaultValues.documentType, [Validators.required]],
      documentNumber: [this.defaultValues.documentNumber, [Validators.required]],
      currency: [this.defaultValues.currency, [Validators.required]],
      amount: [this.defaultValues.amount, [Validators.required]],
      date: [this.defaultValues.date, [Validators.required]],
      valueDate: [this.defaultValues.valueDate, [Validators.required]],
      dueDate: [this.defaultValues.dueDate, [Validators.required]],
      portOfLoading: [this.defaultValues.portOfLoading, [Validators.required]],
      portOfDischarge: [this.defaultValues.portOfDischarge, [Validators.required]],
      shipmentCorporation: [this.defaultValues.shipmentCorporation, [Validators.required]],
      realBeneficiary: [this.defaultValues.realBeneficiary, [Validators.required]],
      invoiceServiceChargeCurrency: [this.defaultValues.invoiceServiceChargeCurrency, [Validators.required]],
      invoiceServiceChargeAmount: [this.defaultValues.invoiceServiceChargeAmount, [Validators.required]]
    });

    const formChangesSubscr = this.invoiceForm.valueChanges.subscribe((val) => {
      let formE = document.getElementById('form');
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.invoiceForm.get('invoiceNumber')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.invoiceForm.patchValue(this.formValue)
  }

  get f() {
    return this.invoiceForm.controls;
  }

  public getSBRList() {
    console.log('Get Invoices')
    const sb =  this.invoiceServices.loadSBR().subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
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

  isControlValid(controlName: string): boolean {
    const control = this.invoiceForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.invoiceForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.invoiceForm.controls[controlName];
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

  openSBRDialog() {
    console.log(this.dataSource.data)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl';
    this.modalOption.animation = true
    const modalRef = this.modalService.open(SbrdatamodalComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
        console.log("row result is " + result)
        this.f.sbrReferenceId.setValue(result.sbrId);
        this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        this.f.counterPartyId.setValue(result.counterParty['customerId']);
        this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
