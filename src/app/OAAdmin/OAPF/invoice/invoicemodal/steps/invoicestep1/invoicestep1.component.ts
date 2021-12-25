import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {Corporateuser} from "../../../../../Model/corporateuser";
import {Customer} from "../../../../../Model/customer";
import {Invoice} from "../../../../../Model/OAPF/Request/invoice";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {DatePipe} from "@angular/common";
import {invoiceService} from "../../../../../shared/OAPF/invoice.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
@Component({
  selector: 'app-invoicestep1',
  templateUrl: './invoicestep1.component.html',
  styleUrls: ['./invoicestep1.component.scss']
})
export class Invoicestep1Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Invoice>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
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
  dataSource: any = new MatTableDataSource<Corporateuser>();
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
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.f.invoiceNumber.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      invoiceNumber: [this.defaultValues.invoiceNumber,[Validators.required]],
      sbrReferenceId: [this.defaultValues.sbrReferenceId,[Validators.required]],
      agreementId: [this.defaultValues.agreementId,[Validators.required]],
      anchorId: [this.defaultValues.anchorId,[Validators.required]],
      counterPartyId: [this.defaultValues.counterPartyId,[Validators.required]],
      documentType: [this.defaultValues.documentType,[Validators.required]],
      documentNumber: [this.defaultValues.documentNumber,[Validators.required]],
      currency: [this.defaultValues.currency,[Validators.required]],
      amount: [this.defaultValues.amount,[Validators.required]],
      date: [this.defaultValues.date,[Validators.required]],
      valueDate: [this.defaultValues.valueDate,[Validators.required]],
      dueDate: [this.defaultValues.dueDate,[Validators.required]],
      agreedPaymentDate: [this.defaultValues.agreedPaymentDate,[Validators.required]],
      portOfLoading: [this.defaultValues.portOfLoading,[Validators.required]],
      portOfDischarge: [this.defaultValues.portOfDischarge,[Validators.required]],
      shipmentCorporation: [this.defaultValues.shipmentCorporation,[Validators.required]],
      realBeneficiary: [this.defaultValues.realBeneficiary,[Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      let formE = document.getElementById('form');
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('invoiceNumber')?.hasError('required') ||
      this.form.get('sbrReferenceId')?.hasError('required') ||
      this.form.get('agreementId')?.hasError('required') ||
      this.form.get('anchorId')?.hasError('required') ||
      this.form.get('counterPartyId')?.hasError('required') ||
      this.form.get('documentType')?.hasError('required') ||
      this.form.get('documentNumber')?.hasError('required') ||
      this.form.get('currency')?.hasError('required') ||
      this.form.get('amount')?.hasError('required') ||
      this.form.get('date')?.hasError('required') ||
      this.form.get('valueDate')?.hasError('required') ||
      this.form.get('dueDate')?.hasError('required') ||
      this.form.get('agreedPaymentDate')?.hasError('required') ||
      this.form.get('portOfLoading')?.hasError('required') ||
      this.form.get('portOfDischarge')?.hasError('required') ||
      this.form.get('shipmentCorporation')?.hasError('required') ||
      this.form.get('realBeneficiary')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.form.patchValue(this.formValue)
    // this.f.invoiceNumber.setValue(this.formValue.invoiceNumber);
    // this.f.sbrReferenceId.setValue(this.formValue.sbrReferenceId);
    // this.f.agreementId.setValue(this.formValue.agreementId);
    // this.f.anchorId.setValue(this.formValue.anchorId);
    // this.f.counterPartyId.setValue(this.formValue.counterPartyId);
    // this.f.documentType.setValue(this.formValue.documentType);
    // this.f.documentNumber.setValue(this.formValue.documentNumber);
    // this.f.currency.setValue(this.formValue.currency);
    // this.f.amount.setValue(this.formValue.amount);
    // const eDate = this.datePipe.transform(new Date(this.formValue.date), "yyyy-MM-dd");
    // this.f.date.setValue(eDate);
    // const eValueDate = this.datePipe.transform(new Date(this.formValue.valueDate), "yyyy-MM-dd");
    // this.f.valueDate.setValue(eValueDate);
    // const eDueDate = this.datePipe.transform(new Date(this.formValue.dueDate), "yyyy-MM-dd");
    // this.f.dueDate.setValue(eDueDate);
    // const eAgreedPaymentDate = this.datePipe.transform(new Date(this.formValue.agreedPaymentDate), "yyyy-MM-dd");
    // this.f.agreedPaymentDate.setValue(eAgreedPaymentDate);
    // this.f.portOfLoading.setValue(this.formValue.portOfLoading);
    // this.f.portOfDischarge.setValue(this.formValue.portOfDischarge);
    // this.f.shipmentCorporation.setValue(this.formValue.shipmentCorporation);
    // this.f.realBeneficiary.setValue(this.formValue.realBeneficiary);
  }

  get f() {
    return this.form.controls;
  }


  selectedSBR(customerId: any) {

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

  openSBRDialog(content: any) {
    this.getSBRList();
    console.log(this.dataSource.data)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    this.modalService.open(content, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
        console.log("row result is "+result)
        this.sbrData = result
        this.f.sbrReferenceId.setValue(result.sbrId);
        this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        this.f.counterPartyId.setValue(result.counterParty['customerId']);
        this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);
      }
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

  isControlValid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.form.controls[controlName];
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

}
