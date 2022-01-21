import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Sbr} from "../../../../Model/sbr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../../Model/OAAdmin/Request/corporateUser";
import {Customer} from "../../../../Model/customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {sbragreementService} from "../../../../shared/sbragreement.service";
import { currencyList } from 'src/app/OAAdmin/shared/currency';

@Component({
  selector: 'app-sbr-amt-info',
  templateUrl: './sbr-amt-info.component.html',
  styleUrls: ['./sbr-amt-info.component.scss']
})
export class SbrAmtInfoComponent implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<Sbr>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Sbr>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
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

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,private datePipe: DatePipe,public sbragreementServices: sbragreementService) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      anchorCustomerContactName: [this.defaultValues.anchorCustomerContactName,[Validators.required]],
      anchorCustomerAddressLine1: [this.defaultValues.anchorCustomerAddressLine1,[Validators.required]],
      anchorCustomerAddressLine2: [this.defaultValues.anchorCustomerAddressLine2,[Validators.required]],
      anchorCustomerAddressLine3: [this.defaultValues.anchorCustomerAddressLine3,[Validators.required]],
      anchorCustomerPOBox: [this.defaultValues.anchorCustomerPOBox,[Validators.required]],
      anchorCustomerEmail: [this.defaultValues.anchorCustomerEmail,[Validators.required]],
      anchorCustomerFax: [this.defaultValues.anchorCustomerFax,[Validators.required]],
      anchorCustomerTelephone: [this.defaultValues.anchorCustomerTelephone,[Validators.required]],
        counterPartyContactName: [this.defaultValues.counterPartyContactName,[Validators.required]],
        counterPartyAddressLine1: [this.defaultValues.counterPartyAddressLine1,[Validators.required]],
        counterPartyAddressLine2: [this.defaultValues.counterPartyAddressLine2,[Validators.required]],
        counterPartyAddressLine3: [this.defaultValues.counterPartyAddressLine3,[Validators.required]],
        counterPartyPOBox: [this.defaultValues.counterPartyPOBox,[Validators.required]],
        counterPartyEmail: [this.defaultValues.counterPartyEmail,[Validators.required]],
        counterPartyFax: [this.defaultValues.counterPartyFax,[Validators.required]],
        counterPartyTelephone: [this.defaultValues.counterPartyTelephone,[Validators.required]],
        managementFeeCurrency: [this.defaultValues.managementFeeCurrency,[Validators.required]],
      managementFeeAmount: [this.defaultValues.managementFeeAmount,[Validators.required]],
      administrativeFeeCurrency: [this.defaultValues.administrativeFeeCurrency,[Validators.required]],
      administrativeFeeAmount: [this.defaultValues.administrativeFeeAmount,[Validators.required]],
      earlyPaymentFeeCurrency: [this.defaultValues.earlyPaymentFeeCurrency,[Validators.required]],
      earlyPaymentAmount: [this.defaultValues.earlyPaymentAmount,[Validators.required]],
      invoiceServiceChargeCurrency: [this.defaultValues.invoiceServiceChargeCurrency,[Validators.required]],
      invoiceServiceChargeAmount: [this.defaultValues.invoiceServiceChargeAmount,[Validators.required]],
      financeServiceChargeCurrency: [this.defaultValues.financeServiceChargeCurrency,[Validators.required]],
      financeServiceChargeAmount: [this.defaultValues.financeServiceChargeAmount,[Validators.required]],
      settlementServiceChargeCurrency: [this.defaultValues.settlementServiceChargeCurrency,[Validators.required]],
      cableChargeCurrency: [this.defaultValues.cableChargeCurrency,[Validators.required]],
      cableChargeAmount: [this.defaultValues.cableChargeAmount,[Validators.required]],
      settlementServiceChargeAmount: [this.defaultValues.settlementServiceChargeAmount,[Validators.required]],
      communicationChargeCurrency: [this.defaultValues.communicationChargeCurrency,[Validators.required]],
      communicationChargeAmount: [this.defaultValues.communicationChargeAmount,[Validators.required]],
      
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
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
  checkForm() {
    return !(
      this.form.get('anchorCustomerAddressLine1')?.hasError('required') ||
      this.form.get('anchorCustomerContactName')?.hasError('required') ||
      this.form.get('anchorCustomerAddressLine2')?.hasError('required') ||
      this.form.get('anchorCustomerAddressLine3')?.hasError('required') ||
      this.form.get('anchorCustomerPOBox')?.hasError('required') ||
      this.form.get('anchorCustomerEmail')?.hasError('required') ||
      this.form.get('anchorCustomerTelephone')?.hasError('required') ||
      this.form.get('anchorCustomerFax')?.hasError('required') ||
      this.form.get('counterPartyAddressLine1')?.hasError('required') ||
      this.form.get('counterPartyContactName')?.hasError('required') ||
      this.form.get('counterPartyAddressLine2')?.hasError('required') ||
      this.form.get('counterPartyAddressLine3')?.hasError('required') ||
      this.form.get('counterPartyPOBox')?.hasError('required') ||
      this.form.get('counterPartyEmail')?.hasError('required') ||
      this.form.get('counterPartyTelephone')?.hasError('required') ||
      this.form.get('counterPartyFax')?.hasError('required') ||
      this.form.get('managementFeeCurrency')?.hasError('required') ||
      this.form.get('managementFeeAmount')?.hasError('required') ||
      this.form.get('administrativeFeeCurrency')?.hasError('required') ||
      this.form.get('administrativeFeeAmount')?.hasError('required') ||
      this.form.get('earlyPaymentFeeAmount')?.hasError('required') ||
      this.form.get('earlyPaymentAmount')?.hasError('required') ||
      this.form.get('invoiceServiceChargeCurrency')?.hasError('required') ||
      this.form.get('invoiceServiceChargeAmount')?.hasError('required') ||
      this.form.get('financeServiceChargeCurrency')?.hasError('required') ||
      this.form.get('financeServiceChargeAmount')?.hasError('required') ||
      this.form.get('settlementServiceChargeCurrency')?.hasError('required') ||
      this.form.get('settlementServiceChargeAmount')?.hasError('required') ||
      this.form.get('cableChargeCurrency')?.hasError('required') ||
      this.form.get('cableChargeAmount')?.hasError('required') ||
      this.form.get('communicationChargeCurrency')?.hasError('required') ||
      this.form.get('communicationChargeAmount')?.hasError('required')
      );
  }


  updateForm()
  {
    this.form.patchValue(this.formValue)
  }

  public getCustomerList() {
    console.log('Get Customer')
    const sb =  this.sbragreementServices.loadSBR().subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

  openCustomerDialog(content: any) {
    this.getCustomerList();
    console.log(this.dataSource.data)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    this.modalService.open(content, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result) {
        console.log("row result is "+result)
   //     this.f.sbrReferenceId.setValue(result.sbrId);
     //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
       // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
