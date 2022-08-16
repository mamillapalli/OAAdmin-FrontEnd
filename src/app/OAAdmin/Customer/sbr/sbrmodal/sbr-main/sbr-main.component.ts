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
import {currencyList} from "../../../../shared/currency";
import { CustomerService } from 'src/app/OAAdmin/shared/customer.service';
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {sbragreementService} from "../../../../shared/sbragreement.service";
import { CustomerDOComponent } from 'src/app/OAAdmin/common/customer-do/customer-do.component';
import { AgreementDoComponent } from 'src/app/OAAdmin/common/agreement-do/agreement-do.component';
import { oapfcommonService } from 'src/app/OAAdmin/shared/oapfcommon.service';
import { Agreementreq } from 'src/app/OAAdmin/Model/agreementreq';
import { MatAccordion } from '@angular/material/expansion';
import { AccountcommonmodalComponent } from 'src/app/OAAdmin/OAPF/common/accountcommonmodal/accountcommonmodal.component';

@Component({
  selector: 'app-sbr-main',
  templateUrl: './sbr-main.component.html',
  styleUrls: ['./sbr-main.component.scss']
})
export class SbrMainComponent implements OnInit {
  public gfg = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input('updateParentModel') updateParentModel: (part: Partial<Sbr>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Sbr>;
  agreementReq: Agreementreq;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  public displayedColumns: string[] = ['customerId','name','addressLine1'];
  clickedRows = new Set<Customer>();
  public currencyList:any = currencyList;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  ReadOnlyCheckBox: boolean;
  ReadOnlyAutoFinancing: boolean;
  counterParties: any;
  checkCustomer: any
  checkCounter: boolean

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal,
    private datePipe: DatePipe,public sbragreementServices: sbragreementService,
    public customerService:CustomerService, public oapfcommonService:oapfcommonService ) {}

  ngOnInit() {
    this.initForm();
    this.agreementReq = new Agreementreq();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
      this.ReadOnlyCheckBox = true
      this.ReadOnlyAutoFinancing = true
    }
    if(this.mode !== 'new') {
      this.updateForm();
    } else if (this.mode == 'new'){
      this.oapfcommonService.getAdminReferenceNumber('sbrs').subscribe((res) => {
        this.f.sbrId.setValue(res);
      });
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.checkCustomer =  this.defaultValues.checkCustomer
    this.form = this.fb.group({
      sbrId: [this.defaultValues.sbrId,[Validators.required]],
      agreement:[this.defaultValues.agreement,[Validators.required]],
      agreementId : [this.defaultValues.agreementId,[Validators.required]],
      rm:[this.defaultValues.rm,[Validators.required]],
      rmId:[this.defaultValues.rmId,[Validators.required]],
      limitTypeFlag: [this.defaultValues.limitTypeFlag,[Validators.required]],
      paymentTermsDays: [this.defaultValues.paymentTermsDays,[Validators.required]],
      paymentTermsCondition: [this.defaultValues.paymentTermsCondition,[Validators.required]],
      autoSettlement: [this.defaultValues.autoSettlement,[Validators.required]],
      autoFinance: [this.defaultValues.autoFinance,[Validators.required]],
      recourseFlag: [this.defaultValues.recourseFlag,[Validators.required]],
      commercialContractDetails: [this.defaultValues.commercialContractDetails,[Validators.required]],
      natureOfBusiness: [this.defaultValues.natureOfBusiness,[Validators.required]],
      goodsDescription: [this.defaultValues.goodsDescription,[Validators.required]],
      directContactFlag: [this.defaultValues.directContactFlag,[Validators.required]],
      anchorCustomer: [this.defaultValues.anchorCustomer,[Validators.required]],
      anchorCustomerId :[this.defaultValues.anchorCustomerId,[Validators.required]],
      anchorCustomerContactName: [this.defaultValues.anchorCustomerContactName,[Validators.required]],
      anchorCustomerEmail: [this.defaultValues.anchorCustomerEmail,[Validators.required]],
      //anchorCustomerTelephone: [this.defaultValues.anchorCustomerTelephone,[Validators.required]],
      anchorPartyAccountId: [this.defaultValues.anchorPartyAccountId,[Validators.required]],
      counterParty:[this.defaultValues.counterParty,[Validators.required]],
      counterPartyId:[this.defaultValues.counterPartyId,[Validators.required]],
      counterPartyContactName: [this.defaultValues.counterPartyContactName,[Validators.required]],
      counterPartyEmail: [this.defaultValues.counterPartyEmail,[Validators.required]],
      //counterPartyTelephone: [this.defaultValues.counterPartyTelephone,[Validators.required]],
      counterPartyAccountId: [this.defaultValues.counterPartyAccountId,[Validators.required]],
      limitCurrency: [this.defaultValues.limitCurrency,[Validators.required]],
      limitAmount: [this.defaultValues.limitAmount,[Validators.required]],
      counterParties: [this.defaultValues.counterParties,[Validators.required]],
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
      this.form.get('sbrId')?.hasError('required') ||
      this.form.get('agreementId')?.hasError('required') ||
      this.form.get('limitTypeFlag')?.hasError('required') ||
      this.form.get('paymentTermsDays')?.hasError('required') ||
      this.form.get('paymentTermsDays')?.hasError('required') ||
      this.form.get('paymentTermsCondition')?.hasError('required') ||
      this.form.get('autoSettlement')?.hasError('required') ||
      this.form.get('autoFinance')?.hasError('required') ||
      this.form.get('recourseFlag')?.hasError('required') ||
      this.form.get('natureOfBusiness')?.hasError('required') ||
      this.form.get('commercialContractDetails')?.hasError('required') ||
      this.form.get('anchorCustomerId')?.hasError('required') ||
      this.form.get('anchorPartyAccountId')?.hasError('required') ||
      this.form.get('counterPartyId')?.hasError('required') ||
      this.form.get('counterPartyAccountId')?.hasError('required')

      );
  }

  updateForm()
  {
    console.log('update form')
    this.form.patchValue(this.formValue)
    this.f.anchorCustomerId.setValue(this.formValue.anchorCustomer['customerId']);
    this.f.anchorCustomer.setValue(this.formValue.anchorCustomer);
    this.f.agreementId.setValue(this.formValue.agreement['contractReferenceNumber'])
    this.f.agreement.setValue(this.formValue.agreement);
    this.f.rmId.setValue(this.formValue.rm.rmId);
    this.f.rm.setValue(this.formValue.rm);
    this.f.counterPartyId.setValue(this.formValue.counterParty['customerId']);
    this.f.counterParty.setValue(this.formValue.counterParty);
    this.counterParties = this.formValue.counterParty
    console.log(this.counterParties)
    this.checkCounter = true;
  }

  public getCustomerList() {
    console.log('Get Customer')
    const sb =  this.customerService.getCustomers().subscribe((res) => {
      console.log('Anil Customer List',res);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = this.createFilter();
    });
  }
  get f() {
    return this.form.controls;
  }

  openCustomerDialog() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size='lg';
    const modalRef = this.modalService.open(CustomerDOComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.form.patchValue(result);
      if (result) {
        console.log("row result is "+result)
        this.f.anchorCustomer.setValue(result.customerId);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);

      }
    }, (reason) => {
      console.log('reason is'+reason);
    });
  }

  openAgreementModal() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size='xl';
    const modalRef = this.modalService.open(AgreementDoComponent, this.modalOption);
    modalRef.result.then((result) => {
      this.form.patchValue(result);
      if (result) {
        console.log("row result is "+result)
        this.checkCustomer = true;
        this.f.anchorCustomerId.setValue(result.anchorCustomer['customerId']);
        this.f.anchorCustomerContactName.setValue(result.anchorCustomer['name']);
        this.f.anchorCustomerEmail.setValue(result.anchorCustomer['emailAddress']);
        this.f.anchorCustomer.setValue(result.anchorCustomer)
        this.f.agreementId.setValue(result.contractReferenceNumber);
        this.agreementReq.contractReferenceNumber = result.contractReferenceNumber;
        this.f.agreement.setValue(this.agreementReq);
        this.f.rmId.setValue(result.rm['rmId']);
        this.f.rm.setValue(result.rm);
        this.f.autoFinance.setValue(result.autoFinance);
        this.f.autoSettlement.setValue(result.autoSettlement);
        this.f.limitCurrency.setValue(result.limitCurrency);
        this.f.limitAmount.setValue(result.limitAmount);
        this.defaultValues.limitCurrency = result.limitCurrency
        this.defaultValues.limitAmount = result.limitAmount
        this.counterParties = result.counterParties
        this.f.counterPartyId.setValue(result.counterParties[0]['customerId']);
        this.f.counterPartyContactName.setValue(result.counterParties[0]['name']);
        this.f.counterPartyEmail.setValue(result.counterParties[0]['emailAddress']);
        this.f.counterParty.setValue(result.counterParties[0]);
        //     this.f.sbrReferenceId.setValue(result.sbrId);
        //   this.f.anchorId.setValue(result.anchorCustomer['customerId']);
        // this.f.counterPartyId.setValue(result.counterParty['customerId']);
        // this.f.agreementId.setValue(result.agreement['contractReferenceNumber']);

      }
    }, (reason) => {
      console.log('reason is'+reason);
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

  openAccountNumber(dataRecord:string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(AccountcommonmodalComponent, this.modalOption);
    modalRef.componentInstance.accountParam = 'CUSTOMER';
    modalRef.componentInstance.customerData = this.f.counterPartyId.value;
    modalRef.result.then((result) => {
      console.log('result is ' + result);
      if(result != null) {
        if(dataRecord === 'anchorCustomerId') {
          this.f.anchorPartyAccountId.setValue(result.accountId)
        } else {
          this.f.counterPartyAccountId.setValue(result.accountId)
        }
      }
    }, (reason) => {
      console.log('reason is ' + reason);
    });
  }

  counterPartiesChange(event:any) {
    console.log('event is '+event);
    let index:number = event.target["selectedIndex"];
    console.log("index" +index)
    this.f.counterPartyId.setValue(this.counterParties[index]['customerId']);
    this.f.counterPartyContactName.setValue(this.counterParties[index]['name']);
    this.f.counterPartyEmail.setValue(this.counterParties[index]['emailAddress']);
    this.f.counterParty.setValue(this.counterParties[index]);
  }
}

