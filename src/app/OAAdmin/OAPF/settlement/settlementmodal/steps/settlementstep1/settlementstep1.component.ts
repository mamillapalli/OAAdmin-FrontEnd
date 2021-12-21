import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Corporateuser} from "../../../../../Model/corporateuser";
import {SelectionModel} from "@angular/cdk/collections";
import {invoiceService} from "../../../../../shared/OAPF/invoice.service";
import {SbrmodalComponent} from "../../../../common/sbrmodal/sbrmodal.component";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {Payment} from "../../../../../Model/OAPF/Request/payment";
import {FinancemodalComponent} from "../../../../common/financemodal/financemodal.component";
import {paymentService} from "../../../../../shared/OAPF/payment.service";
import {oaCommonService} from "../../../../../shared/oacommon.service";
@Component({
  selector: 'app-settlementstep1',
  templateUrl: './settlementstep1.component.html',
  styleUrls: ['./settlementstep1.component.scss']
})
export class Settlementstep1Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (part: Partial<Payment>,isFormValid: boolean) => void;
  @Input() mode :  any;
  @Input('formValue') formValue :  any;
  @Input() defaultValues: Partial<Payment>;
  public currencyList:any = currencyList;
  paymentForm: FormGroup
  modalOption: NgbModalOptions = {};
  private unsubscribe: Subscription[] = [];

  //Invoices
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<Corporateuser>();
  private subscriptions: Subscription[] = [];
  displayedColumns: string[] = [ 'invoiceNumber', 'currency', 'amount', 'dueDate', 'status' ];
  invoiceList: FormArray = this.fb.array([]);
  //checkbox
  selection = new SelectionModel<Element>(true, []);
  invoiceSelected: boolean = false
  referenceNumber:string;
  isFinanceFetched: boolean = false;

  constructor(public modalService: NgbModal,
              private fb: FormBuilder,
              public paymentService: paymentService,
              public oaCommonService: oaCommonService
  ) { }

  ngOnInit(): void {
    this.initForm()
    if(this.mode === 'new')
    {
      this.oaCommonService.getReferenceNumber('payment').subscribe((res) => {
        this.f.paymentId.setValue(res);
      });
    } else {
      this.f.financeId.disabled
      this.updateForm();
      if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
      {
        this.paymentForm.disable()
      }
    }
    this.updateParentModel({}, this.checkForm());
  }

  checkForm() {
    return !(
      this.paymentForm.get('paymentId')?.hasError('required')
    );
  }

  initForm(){
   this.paymentForm = this.fb.group({
      paymentId: [this.defaultValues.paymentId,[Validators.required]],
      sbrReferenceId: [this.defaultValues.sbrReferenceId,[Validators.required]],
      agreementId: [this.defaultValues.agreementId,[Validators.required]],
      buyerId: [this.defaultValues.buyerId,[Validators.required]],
      sellerId: [this.defaultValues.sellerId,[Validators.required]],
      buyerName: [this.defaultValues.buyerName,[Validators.required]],
      sellerName: [this.defaultValues.sellerName,[Validators.required]],
      paymentType: [this.defaultValues.paymentType,[Validators.required]],
      businessType: [this.defaultValues.businessType,[Validators.required]],
      finance: this.defaultValues.finance,
      financeId: ['', [Validators.required]],
    });

    const formChangesSubscr = this.paymentForm.valueChanges.subscribe((val) => {
      let formE = document.getElementById('paymentForm');
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);

  }

  updateForm() {
    this.paymentForm.patchValue(this.formValue)
    this.f.financeId.setValue(this.formValue.finance['financeId']);
    if(this.formValue.finance['financeId'])
    {
        this.isFinanceFetched = true;
    }
    this.dataSource.data = this.formValue.finance['invoiceList'];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  isControlValid(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.paymentForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.paymentForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.form.controls[controlName];
    return false;
  }

  get f() {
    return this.paymentForm.controls;
  }

  get array(): FormArray {
    return this.paymentForm.get('invoiceList') as FormArray;
  }

  openFinanceDialog()
  {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(FinancemodalComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.paymentForm.patchValue(result)
      this.f.financeId.setValue(result.financeId)
      this.f.sbrReferenceId.setValue(result.sbrReferenceId)
      this.f.agreementId.setValue(result.agreementId)
      this.f.businessType.setValue(result.businessType)
      this.f.buyerId.setValue(result.buyerId)
      this.f.buyerName.setValue(result.buyerName)
      this.f.sellerId.setValue(result.sellerId)
      this.f.sellerName.setValue(result.sellerName)
      this.f.paymentType.setValue('PAYMENT_BY_BUYER')

      this.f.finance.setValue(result)
      console.log(this.paymentForm)

      let resInv = result.invoiceList
      console.log('Invoice List is '+resInv)

      this.dataSource.data = resInv;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.isFinanceFetched = true;

      //this.f.finance.setValue()
      console.log('result is ' + result);
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }

}
